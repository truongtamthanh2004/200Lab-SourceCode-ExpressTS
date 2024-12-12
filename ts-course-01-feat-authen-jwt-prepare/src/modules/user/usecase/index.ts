import { IRepository, TokenPayload } from "@share/interface";
import { ErrDataNotFound } from "@share/model/base-error";
import { PagingDTO } from "@share/model/paging";
import { v7 } from "uuid";
import { IUserUseCase } from "../interface";
import { Gender, Role, Status, User, UserCondDTO, userCondDTOSchema, UserLoginDTO, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO, userUpdateDTOSchema } from "../model";

export class UserUseCase implements IUserUseCase {
  constructor(private readonly repository: IRepository<User, UserCondDTO, UserUpdateDTO>) { }
  
  verifyToken(token: string): Promise<TokenPayload> {
    throw new Error("Method not implemented.");
  }

  login(data: UserLoginDTO): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async register(data: UserRegistrationDTO): Promise<string> {
    const dto = UserRegistrationDTOSchema.parse(data);

    const newId = v7();
    const newUser: User = {
      ...dto,
      id: newId,
      status: Status.ACTIVE,
      gender: Gender.UNKNOWN,
      salt: "",
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
