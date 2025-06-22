import { CrudService } from './CrudService';
import { User, UserModel } from '@/lib/models/user.model';

export class UserService extends CrudService<User> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email }).exec();
  }
}

export default new UserService();
