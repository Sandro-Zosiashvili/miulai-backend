import { HttpException, Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../album/entities/album.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../aws/services/s3.service';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicRepository {
  constructor(
    @InjectRepository(Music)
    private readonly repository: Repository<Music>,
    private readonly s3service: S3Service,
  ) {}

  async create(createMusicDto: CreateMusicDto, file: Express.Multer.File) {
    const result = await this.s3service.upload(file);
    if (!result) {
      throw new HttpException('Failed to upload into the base', 500);
    }

    const newMusic = this.repository.create({
      ...createMusicDto,
      music: result.Location,
      imageKey: result.Key,
    });

    return this.repository.save(newMusic);
  }

  async findAll() {
    // 1. ყველა მუსიკის ჩატვირთვა ალბომის ინფორმაციით
    const musics = await this.repository.find({
      relations: ['album'],
    });

    if (!musics || musics.length === 0) {
      throw new HttpException('No music found', 404);
    }

    // 2. Presigned URL-ების დამატება თითოეული მუსიკისთვის
    const musicsWithPresignedUrls = await Promise.all(
      musics.map(async (music) => {
        // მუსიკის ფაილის URL
        if (music.imageKey) {
          music.music = await this.s3service.getPresignedUrl(music.imageKey);
        }

        // ალბომის ყდის URL (თუ არსებობს ალბომი)
        if (music.album?.imageKey) {
          music.album.albumImage = await this.s3service.getPresignedUrl(
            music.album.imageKey,
          );
        }

        return music;
      }),
    );

    // 3. შედეგის დაბრუნება
    return musicsWithPresignedUrls;
  }
}
