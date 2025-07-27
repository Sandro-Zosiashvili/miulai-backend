import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { S3Service } from '../aws/services/s3.service';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,
    private readonly s3service: S3Service,
  ) {
  }

  async create(data: CreateAuthorDto, file: Express.Multer.File) {
    const result = await this.s3service.upload(file);

    if (!result) {
      throw new HttpException('Failed to upload into the base', 500);
    }
    const newAuthor = this.repository.create({
      artistName: data.artistName,
      artistBiography: data.artistBiography,
      artistPhoto: result.Location,
    });
    return await this.repository.save(newAuthor);
  }


  async findById(id: string): Promise<Author> {
      

      return
  }

  async findAll() {
    return await this.repository.find();
  }
}
