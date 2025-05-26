import { IUser, IUserDoc, User } from '../models/user.model';
import { CrudService } from './CrudService';

export class UserService extends CrudService<IUserDoc, IUser> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string) {
    return await this.findOne({ email })
  }
}

export default new UserService();
