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

  async create(
    fileName: string,
    fileKey: string,
    fileLocation: string,
    fileBucket: string,
  ) {
    const newFile = new FileEntity();
    newFile.fileName = fileName;
    newFile.url = fileLocation;
    newFile.key = fileKey;
    newFile.bucket = fileBucket;

    return this.repository.save(newFile);
  }

  async findAll() {
    return this.repository.find();
  }
}
