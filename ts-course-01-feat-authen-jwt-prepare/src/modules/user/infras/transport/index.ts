import { IUserUseCase } from "@modules/user/interface";
import { User, UserCondDTO, UserRegistrationDTO, UserUpdateDTO } from "@modules/user/model";
import { BaseHttpService } from "@share/transport/http-server";

export class UserHTTPService extends BaseHttpService<User, UserRegistrationDTO, UserUpdateDTO, UserCondDTO> {
  constructor(useCase: IUserUseCase) {
    super(useCase);
  }
}