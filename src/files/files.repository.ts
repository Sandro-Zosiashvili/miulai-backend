import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { S3Service } from '../aws/services/s3.service';
import { HttpException } from '@nestjs/common';

@Injectable()
export class Files {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: Repository<FileEntity>,
    private readonly S3service: S3Service,
  ) {}

  async create(file: Express.Multer.File) {
    // const buffer = file.buffer;
    //
    // const fileName = file.originalname.replace(/\.png$/i, '');
    //
    const result = await this.S3service.upload(file);

    if (!result) {
      throw new HttpException('Failed to upload into the base', 500);
    }
    console.log(result)
    return file;
  }

  async findAll() {
    return this.repository.find();
  }
}
