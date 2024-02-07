import { User } from 'src/user/user.entity';
import { ProfileSchema } from './schemas/profile';

export const mapProfileSchema = (
  user: User,
  currentUserEmail?: string,
): ProfileSchema => {
  return {
    bio: user.bio,
    id: user.id,
    image: user.image,
    following: currentUserEmail
      ? user.followers.some((u) => u.email === currentUserEmail)
      : false,
    username: user.username,
  };
};
