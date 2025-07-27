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

  async create(createAuthorDto: CreateAuthorDto, file: Express.Multer.File) {
    return this.authorRepository.create(createAuthorDto, file);
  }

  findAll() {
    return this.authorRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
