import { TypeOrm, User } from '../orm';

export interface CreateUserParams {
  name: string;
}

export class UsersRepository {
  constructor(
    private orm: TypeOrm
  ) {}

  createUser = async (params: CreateUserParams) => {
    const user = new User();
    user.name = params.name;
    await this.orm.manager.save(user);
    return user.id;
  }
}
