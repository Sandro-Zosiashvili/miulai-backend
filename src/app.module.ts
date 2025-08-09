import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { FilesModule } from './files/files.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { AlbumModule } from './album/album.module';
import { MusicModule } from './music/music.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // <- დაამატეთ ეს პირველად (აუცილებელია .env-ის ჩატვირთვისთვის)
    TypeOrmModule.forRoot({
      type: 'mysql', // ან postgres
      host: 'maglev.proxy.rlwy.net',
      port: 34758,
      username: 'root',
      password: 'OYNRPAkCfoUPOxPqlVpaOZBFTvPOmOLG',
      database: 'railway',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Railway-ზე SSL-ისთვის
      },
    }),
    AuthorModule,
    FilesModule,
    AwsModule,
    AlbumModule,
    MusicModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
