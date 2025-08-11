import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistsRepository } from './playlists.repository';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistsRepo: PlaylistsRepository) {}
  create(createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsRepo.create(createPlaylistDto);
  }

  findAll() {
    return this.playlistsRepo.findAll();
  }

  findOne(id: number) {
    return this.playlistsRepo.findOne(id);
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
