import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { FilesService } from '../files/files.service';

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
