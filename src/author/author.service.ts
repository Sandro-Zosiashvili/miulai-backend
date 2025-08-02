import { Injectable, HttpException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorRepository } from './author.repository';
import { S3Service } from '../aws/services/s3.service';

@Injectable()
export class AuthorService {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly s3service: S3Service,
  ) {}

  async create(
    createAuthorDto: CreateAuthorDto,
    photo: Express.Multer.File,
    cover: Express.Multer.File,
  ) {
    return this.authorRepository.create(createAuthorDto, photo, cover);
  }

  findAll() {
    return this.authorRepository.findAll();
  }

  findOne(id: number) {
    return this.authorRepository.findOne(id);
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return this.authorRepository.remove(id);
  }

  getTopSongs(authorId: number) {
    return this.authorRepository.getTopSongs(authorId);
  }
}
