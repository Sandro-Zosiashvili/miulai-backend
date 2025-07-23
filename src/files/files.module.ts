import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Files } from './files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { AwsModule } from '../aws/aws.module';
import { S3Service } from '../aws/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), AwsModule],
  controllers: [FilesController],
  providers: [FilesService, Files, S3Service],
})
export class FilesModule {}
