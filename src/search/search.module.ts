import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../album/entities/album.entity';
import { Author } from '../author/entities/author.entity';
import { Music } from '../music/entities/music.entity';
import { SearchRepository } from './search.repository';
import { S3Service } from '../aws/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Author, Music])],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository, S3Service],
})
export class SearchModule {}
