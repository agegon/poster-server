import { User } from 'src/user/user.entity';
import { IProfileSchema } from './profile.interfaces';

export const mapProfileSchema = (
  user: User,
  currentUserEmail?: string,
): IProfileSchema => {
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
