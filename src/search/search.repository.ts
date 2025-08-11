import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from '../music/entities/music.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../aws/services/s3.service';
import { Author } from '../author/entities/author.entity';
import { Album } from '../album/entities/album.entity';

@Injectable()
export class SearchRepository {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly s3service: S3Service,
  ) {}

  async globalSearch(searchTerm: string) {
    // Search in Music
    const musicResults = await this.musicRepository
      .createQueryBuilder('music')
      .where('music.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .leftJoinAndSelect('music.author', 'author')
      .leftJoinAndSelect('music.album', 'album')
      .getMany();

    // Search in Authors
    const authorResults = await this.authorRepository
      .createQueryBuilder('author')
      .where('author.artistName LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('author.artistBiography LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();

    // Search in Albums
    const albumResults = await this.albumRepository
      .createQueryBuilder('album')
      .where('album.albumName LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .leftJoinAndSelect('album.author', 'author')
      .getMany();

    // Process results (add S3 URLs if needed)
    const processedMusic = await Promise.all(
      musicResults.map(async (music) => {
        if (music.imageKey) {
          music.music = await this.s3service.getPresignedUrl(music.imageKey);
        }

        if (music.album.imageKey) {
          music.album.albumImage = await this.s3service.getPresignedUrl(
            music.album.imageKey,
          );
        }
        return music;
      }),
    );

    const processedAlbum = await Promise.all(
      albumResults.map(async (album) => {
        if (album.imageKey) {
          album.albumImage = await this.s3service.getPresignedUrl(
            album.imageKey,
          );
        }
        return album;
      }),
    );

    const processedAuthor = await Promise.all(
      authorResults.map(async (authorResult) => {
        if (authorResult.imageKey) {
          authorResult.artistPhoto = await this.s3service.getPresignedUrl(
            authorResult.imageKey,
          );
        }
        return authorResult;
      }),
    );

    return {
      music: processedMusic,
      authors: processedAuthor,
      albums: processedAlbum,
    };
  }
}
