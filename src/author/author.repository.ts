import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,
  ) {}

  create(data: CreateAuthorDto) {
    const newAuthor = this.repository.create(data);
    return this.repository.save(newAuthor);
  }

  async findAll() {
    return await this.repository.find();
  }
}
