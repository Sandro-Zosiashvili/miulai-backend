import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorRepository } from './author.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { S3Service } from '../aws/services/s3.service';
import { Album } from '../album/entities/album.entity';
import { Music } from '../music/entities/music.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Album, Music])],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository, S3Service],
})
export class AuthorModule {}
