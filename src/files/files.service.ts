import { HttpException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Files } from './files.repository';
import { S3Service } from '../aws/services/s3.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepo: Files,
    private readonly s3service: S3Service,
  ) {}

  async create(file: Express.Multer.File) {
    const fileName = file.originalname.replace(/\.png$/i, '');
    const buffer = file.buffer;
    const result = await this.s3service.upload(file);

    if (!result) {
      throw new HttpException('Failed to upload into the base', 500);
    }
    if (!buffer) {
      throw new HttpException('Failed to upload into the base', 500);
    }

    if (!fileName) {
      throw new HttpException('Failed to upload into the base', 500);
    }

    const fileLocation = result.Location;
    const fileKey = result.Key;
    const fileBucket = result.Bucket;

    console.log(result);
    return this.filesRepo.create(fileName, fileKey, fileLocation, fileBucket);
  }

  findAll() {
    return this.filesRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
