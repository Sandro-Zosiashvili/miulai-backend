import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Repository } from 'typeorm';
import { S3Service } from '../aws/services/s3.service';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
    private readonly s3service: S3Service,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, file: Express.Multer.File) {
    const result = await this.s3service.upload(file);
    if (!result) {
      throw new HttpException('Failed to upload into the base', 500);
    }

    const newAlbum = this.repository.create({
      ...createAlbumDto,
      albumImage: result.Location,
      imageKey: result.Key,
    });

    return this.repository.save(newAlbum);
  }

  async findOne(id: number) {
    const album = await this.repository.findOne({ where: { id } });

    if (!album) {
      throw new HttpException('Failed to get author', 500);
    }
    const presignedFile = await this.s3service.getPresignedUrl(album.imageKey);
    album.albumImage = presignedFile;

    return album;
  }

  async findAll() {
    // 1. Get all authors from repository
    const albums = await this.repository.find({
      relations: ['author'],
    });

    if (!albums || albums.length === 0) {
      throw new HttpException('No authors found', 404);
    }

    // 2. Process each author to get presigned URL
    const authorsWithPresignedUrls = await Promise.all(
      albums.map(async (author) => {
        if (author.imageKey) {
          const presignedFile = await this.s3service.getPresignedUrl(
            author.imageKey,
          );
          author.albumImage = presignedFile;
        }
        return author;
      }),
    );

    // 3. Return the modified list
    return authorsWithPresignedUrls;
  }
}
