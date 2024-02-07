import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
