import { AppError } from "@share/app-error";
import { jwtProvider } from "@share/component/jwt";
import { IRepository, TokenPayload, UserRole } from "@share/interface";
import { ErrDataNotFound } from "@share/model/base-error";
import { PagingDTO } from "@share/model/paging";
import bcrypt from "bcrypt";
import { v7 } from "uuid";
import { IUserUseCase } from "../interface";
import { Gender, Status, User, UserCondDTO, userCondDTOSchema, UserLoginDTO, UserLoginDTOSchema, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO, userUpdateDTOSchema } from "../model";
import { ErrEmailExisted, ErrInvalidEmailAndPassword, ErrInvalidToken, ErrUserInactivated } from "../model/error";

export class UserUseCase implements IUserUseCase {
  constructor(private readonly repository: IRepository<User, UserCondDTO, UserUpdateDTO>) { }
  
  async profile(userId: string): Promise<User> {
    const user = await this.repository.get(userId);
    if (!user) {
      throw ErrDataNotFound;
    }

    return user;
  }
  
  async verifyToken(token: string): Promise<TokenPayload> {
    const payload = await jwtProvider.verifyToken(token);

    if (!payload) {
      throw ErrInvalidToken;
    }

    const user = await this.repository.get(payload.sub);
    if (!user) {
      throw ErrDataNotFound;
    }

    if (user.status === Status.DELETED || user.status === Status.INACTIVE || user.status === Status.BANNED) {
      throw ErrUserInactivated;
    }

    return { sub: user.id, role: user.role };    
  }

  async login(data: UserLoginDTO): Promise<string> {
    const dto = UserLoginDTOSchema.parse(data);
    
    // 1. Find user with email from DTO
    const user = await this.repository.findByCond({email: dto.email});
    if (!user) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog('Email not found');
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(`${dto.password}.${user.salt}`, user.password);
    if (!isMatch) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog('Password is incorrect');
    }

    if (user.status === Status.DELETED || user.status === Status.INACTIVE) {
      throw AppError.from(ErrUserInactivated, 400);
    }

    // 3. Return token
    const role = user.role;
    const token = jwtProvider.generateToken({sub: user.id, role});
    return token;
  }

  async register(data: UserRegistrationDTO): Promise<string> {
    const dto = UserRegistrationDTOSchema.parse(data);

    // 1. Check email existed
    const existedUser = await this.repository.findByCond({email: dto.email});
    if (existedUser) {
      throw ErrEmailExisted;
    }

    // 2. Gen salt and hash password
    // const salt = generateRandomString(20);
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(`${dto.password}.${salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...dto,
      password: hashPassword,
      id: newId,
      status: Status.ACTIVE,
      gender: Gender.UNKNOWN,
      salt: salt,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Insert new user to database
    await this.repository.insert(newUser);

    return newId;
  }

  async create(data: UserRegistrationDTO): Promise<string> {
    return await this.register(data);
  }

  async getDetail(id: string): Promise<User | null> {
    const data = await this.repository.get(id);

    if (!data || data.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    return data;
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    const dto = userUpdateDTOSchema.parse(data);

    const product = await this.repository.get(id);
    if (!product || product.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.update(id, dto);

    return true;
  }

  async list(cond: UserCondDTO, paging: PagingDTO): Promise<User[]> {
    const parsedCond = userCondDTOSchema.parse(cond);

    return await this.repository.list(parsedCond, paging);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.get(id);

    if (!product || product.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.delete(id, false);

    return true;
  }
}
