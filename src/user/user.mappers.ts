import { UserSchema } from './schemas/user';
import { User } from './user.entity';

export const mapUserSchema = (user: User): UserSchema => {
  return {
    bio: user.bio,
    email: user.email,
    id: user.id,
    image: user.image,
    username: user.username,
  };
};
