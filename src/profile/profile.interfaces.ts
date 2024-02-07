export interface IProfileSchema {
  bio: string;
  following: boolean;
  id: number;
  image?: string;
  username: string;
}

export interface IProfileResponseSchema {
  profile: IProfileSchema;
}
