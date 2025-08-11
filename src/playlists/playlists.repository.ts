import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { NotFoundException } from '@nestjs/common';

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

  async findOne(id: number) {
    const playlists = await this.repository.findOne({ where: { id } });

    if (!playlists) {
      throw new NotFoundException();
    }
    return playlists;
  }
}
