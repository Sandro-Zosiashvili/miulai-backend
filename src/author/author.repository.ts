import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { S3Service } from '../aws/services/s3.service';
import { Album } from '../album/entities/album.entity';
import { Music } from '../music/entities/music.entity';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,
    private readonly s3service: S3Service,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
  ) {}

  async create(
    data: CreateAuthorDto,
    file: Express.Multer.File,
    coverFile: Express.Multer.File,
  ) {
    const result = await this.s3service.upload(file);
    const resultTwo = await this.s3service.upload(coverFile);

    if (!result) {
      throw new HttpException('Failed to upload into the base', 500);
    }
    if (!resultTwo) {
      throw new HttpException('Failed to upload into the base', 500);
    }

    const newAuthor = this.repository.create({
      artistName: data.artistName,
      artistBiography: data.artistBiography,
      artistPhoto: result.Location,
      imageKey: result.Key,
      artistCover: resultTwo.Location,
      artistCoverKey: resultTwo.Key,
    });
    return await this.repository.save(newAuthor);
  }

  async findOne(id: number) {
    const author = await this.repository.findOne({
      where: { id },
      relations: ['albums'],
    });

    if (!author) {
      throw new HttpException('Author not found', 404);
    }

    if (author.imageKey) {
      author.artistPhoto = await this.s3service.getPresignedUrl(
        author.imageKey,
      );
    }

    if (author.artistCoverKey) {
      author.artistCover = await this.s3service.getPresignedUrl(
        author.artistCoverKey,
      );
    }

    if (author.albums && author.albums.length > 0) {
      author.albums = await Promise.all(
        author.albums.map(async (album) => {
          if (album.imageKey) {
            album.albumImage = await this.s3service.getPresignedUrl(
              album.imageKey,
            );
          }
          return album;
        }),
      );
    }
    return author;
  }

  async findAll() {
    const authors = await this.repository.find({
      relations: ['albums'],
    });

    if (!authors || authors.length === 0) {
      throw new HttpException('No authors found', 404);
    }

    const processedAuthors = await Promise.all(
      authors.map(async (author) => {
        if (author.imageKey) {
          author.artistPhoto = await this.s3service.getPresignedUrl(
            author.imageKey,
          );
        }

        if (author.artistCoverKey) {
          author.artistCover = await this.s3service.getPresignedUrl(
            author.artistCoverKey,
          );
        }

        if (author.albums && author.albums.length > 0) {
          author.albums = await Promise.all(
            author.albums.map(async (album) => {
              if (album.imageKey) {
                album.albumImage = await this.s3service.getPresignedUrl(
                  album.imageKey,
                );
              }
              return album;
            }),
          );
        }

        return author;
      }),
    );
    return processedAuthors;
  }

  async remove(id: number) {
    return this.repository.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Find author with albums
        const author = await transactionalEntityManager.findOne(Author, {
          where: { id },
          relations: ['albums'],
        });

        if (!author) {
          throw new HttpException('Author not found', 404);
        }

        // 2. Delete all S3 files first
        if (author.imageKey) await this.s3service.deleteFile(author.imageKey);
        await Promise.all(
          author.albums?.map((album) =>
            album.imageKey
              ? this.s3service.deleteFile(album.imageKey)
              : Promise.resolve(),
          ) || [],
        );

        // 3. Delete all albums (removes foreign key constraint)
        if (author.albums?.length) {
          await transactionalEntityManager.remove(Album, author.albums);
        }

        // 4. Now safely delete the author
        await transactionalEntityManager.remove(Author, author);

        return { success: true, message: 'Author and albums deleted' };
      },
    );
  }

  async getTopSongs(authorId: number, limit: number = 10): Promise<Music[]> {
    // 1. მივიღოთ მუსიკები ალბომებთან ერთად
    const songs = await this.musicRepository
      .createQueryBuilder('music')
      .innerJoinAndSelect('music.album', 'album')
      .where('album.authorId = :authorId', { authorId })
      .orderBy('music.playCount', 'DESC')
      .take(limit)
      .getMany();

    // 2. გენერირება პრესაინდირებული URL-ების ალბომების სურათებისთვის
    await Promise.all(
      songs.map(async (song) => {
        if (song.album?.imageKey) {
          song.album.albumImage = await this.s3service.getPresignedUrl(
            song.album.imageKey,
          );
        }
        return song;
      }),
    );

    return songs;
  }
}
