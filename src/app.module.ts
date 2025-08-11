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
import { PlaylistsModule } from './playlists/playlists.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthorModule,
    FilesModule,
    AwsModule,
    AlbumModule,
    MusicModule,
    UserModule,
    AuthModule,
    PlaylistsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
