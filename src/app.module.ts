import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // ან postgres
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'miulai-backend-base',
      autoLoadEntities: true,
      synchronize: true, // dev რეჟიმში OK, პროდაქშენში — არა!
    }),
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
