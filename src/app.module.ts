import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { FilesModule } from './files/files.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // <- დაამატეთ ეს პირველად (აუცილებელია .env-ის ჩატვირთვისთვის)
    TypeOrmModule.forRoot({
      type: 'mysql', // ან postgres
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'miulai-backend-base',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthorModule,
    FilesModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
