import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsRepository {
  constructor(
    @InjectRepository(Playlist)
    private readonly repository: Repository<Playlist>,
  ) {}

  create(createPlaylistDto: CreatePlaylistDto) {
    const newPlaylist = this.repository.create(createPlaylistDto);
    return this.repository.save(newPlaylist);
  }

  findAll() {
    return this.repository.find();
  }
}
