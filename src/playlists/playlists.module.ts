import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsRepository } from './playlists.repository';
import { MusicRepository } from '../music/music.repository';
import { Music } from '../music/entities/music.entity';
import { S3Service } from '../aws/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Music])],
  controllers: [PlaylistsController],
  providers: [
    PlaylistsService,
    PlaylistsRepository,
    MusicRepository,
    S3Service,
  ],
})
export class PlaylistsModule {}
