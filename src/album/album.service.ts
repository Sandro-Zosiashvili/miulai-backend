import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumRepository } from './album.repository';

@Injectable()
export class AlbumService {
  constructor(private readonly albumrepository: AlbumRepository) {}

  create(createAlbumDto: CreateAlbumDto, file: Express.Multer.File) {
    return this.albumrepository.create(createAlbumDto, file);
  }

  findAll() {
    return this.albumrepository.findAll();
  }

  findOne(id: number) {
    return this.albumrepository.findOne(id);
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return this.albumrepository.remove(id);
  }
}
