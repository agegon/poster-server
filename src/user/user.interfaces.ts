export interface IUserSchema {
  bio: string;
  email: string;
  id: number;
  image: string;
  username: string;
}

export interface IUserResponseSchema {
  token: string;
  user: IUserSchema;
}
