import { HttpException, Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../aws/services/s3.service';
import { Music } from './entities/music.entity';
import * as mm from 'music-metadata';
import { Readable } from 'stream';

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

    const metadata = await mm.parseBuffer(file.buffer);
    const duration = metadata.format.duration ?? 0;

    const newMusic = this.repository.create({
      ...createMusicDto,
      duration: duration,
      music: result.Location,
      imageKey: result.Key,
    });

    return this.repository.save(newMusic);
  }

  async findOne(id: number) {
    const music = await this.repository.findOne({
      where: { id },
      relations: ['album', 'author'],
    });

    if (!music) {
      throw new HttpException('Music with this id was not found', 404);
    }

    music.playCount += 1;
    await this.repository.save(music);
    if (music.imageKey) {
      music.music = await this.s3service.getPresignedUrl(music.imageKey);
    }

    // თუ ალბომს აქვს imageKey, მივიღოთ პრესაინდირებული URL
    if (music.album?.imageKey) {
      music.album.albumImage = await this.s3service.getPresignedUrl(
        music.album.imageKey,
      );
    }

    if (music.author?.artistCoverKey) {
      music.author.artistCover = await this.s3service.getPresignedUrl(
        music.author.artistCoverKey,
      );
    }
    return music;
  }

  async findAll() {
    const musics = await this.repository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.author', 'author')
      .orderBy('music.playCount', 'DESC')

      .getMany();

    if (!musics || musics.length === 0) {
      throw new HttpException('No music found', 404);
    }

    const musicsWithPresignedUrls = await Promise.all(
      musics.map(async (music) => {
        if (music.imageKey) {
          music.music = await this.s3service.getPresignedUrl(music.imageKey);
        }
        if (music.author?.artistCoverKey) {
          music.author.artistCover = await this.s3service.getPresignedUrl(
            music.author.artistCoverKey,
          );
        }

        if (music.album?.imageKey) {
          music.album.albumImage = await this.s3service.getPresignedUrl(
            music.album.imageKey,
          );
        }

        return music;
      }),
    );

    return musicsWithPresignedUrls;
  }

  async topSongs(limit: number) {
    const musics = await this.repository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.author', 'author')
      .leftJoinAndSelect('music.album', 'album')
      .orderBy('music.playCount', 'DESC')
      .limit(limit)
      .getMany();

    if (!musics || musics.length === 0) {
      throw new HttpException('No music found', 404);
    }

    const musicsWithPresignedUrls = await Promise.all(
      musics.map(async (music) => {
        if (music.imageKey) {
          music.music = await this.s3service.getPresignedUrl(music.imageKey);
        }
        if (music.author?.artistCoverKey) {
          music.author.artistCover = await this.s3service.getPresignedUrl(
            music.author.artistCoverKey,
          );
        }

        if (music.album?.imageKey) {
          music.album.albumImage = await this.s3service.getPresignedUrl(
            music.album.imageKey,
          );
        }

        return music;
      }),
    );

    return musicsWithPresignedUrls;
  }

  async remove(id: number): Promise<void> {
    const music = await this.repository.findOne({ where: { id } });

    if (!music) {
      throw new HttpException('No music found', 404);
    }
    if (music.imageKey) {
      try {
        await this.s3service.deleteFile(music.imageKey);
      } catch (error) {
        console.error('AWS file deleting error:', error);
      }
    }
    await this.repository.delete(id);

    console.log(`Music ${id} delete successfully`);
  }
}
