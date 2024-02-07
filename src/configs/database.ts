import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeORMConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const host = configService.get<string>('POSTGRES_HOST');
  const port = +configService.get<string>('POSTGRES_PORT');
  const database = configService.get<string>('POSTGRES_DB_NAME');
  const username = configService.get<string>('POSTGRES_USERNAME');
  const password = configService.get<string>('POSTGRES_PASSWORD');

  return {
    host,
    port,
    database,
    username,
    password,
    type: 'postgres',
    autoLoadEntities: true,
  };
};
