import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppErros";
import { deleteFile } from "../../../../utils/file";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
  avatar_file?: string;
}
@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepsitory: IUsersRepository
  ) {}
  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepsitory.findById(user_id);
    if (!user) {
      throw new AppError("Email or password incorret!");
    }

    if (user.avatar) {
      await deleteFile(`./tmp/avatar/${user.avatar}`);
    }

    user.avatar = avatar_file;
    await this.usersRepsitory.create(user);
  }
}

export { UpdateUserAvatarUseCase };
