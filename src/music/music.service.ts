import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicRepository } from './music.repository';

@Injectable()
export class MusicService {
  constructor(private readonly musicRepository: MusicRepository) {}

  create(createMusicDto: CreateMusicDto, file: Express.Multer.File) {
    return this.musicRepository.create(createMusicDto, file);
  }

  findAll() {
    return this.musicRepository.findAll();
  }

  findOne(id: number) {
    return this.musicRepository.findOne(id);
  }

  update(id: number, updateMusicDto: UpdateMusicDto) {
    return `This action updates a #${id} music`;
  }

  remove(id: number) {
    return this.musicRepository.remove(id);
  }

  topSongs(limit: number) {
    return this.musicRepository.topSongs(limit);
  }
}
