import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Repository } from 'typeorm';
import { S3Service } from '../aws/services/s3.service';
import { Music } from '../music/entities/music.entity';

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
    const album = await this.repository.findOne({
      where: { id },
      relations: ['author', 'musics'],
    });

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
      relations: ['author', 'musics'],
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

  async remove(id: number): Promise<void> {
    // 1. ვიპოვოთ ალბომი მისი მუსიკებით
    const album = await this.repository.findOne({
      where: { id },
      relations: ['musics'],
    });

    if (!album) {
      throw new HttpException('ალბომი ვერ მოიძებნა', 404);
    }

    // 2. წავშალოთ ყველა მუსიკის ფაილები AWS S3-დან
    if (album.musics && album.musics.length > 0) {
      for (const music of album.musics) {
        if (music.imageKey) {
          await this.s3service
            .deleteFile(music.imageKey)
            .catch((e) =>
              console.error(`ფაილის წაშლის შეცდომა ${music.imageKey}:`, e),
            );
        }
        if (music.imageKey) {
          // თუ მუსიკას აქვს ცალკე ფაილის გასაღები
          await this.s3service
            .deleteFile(music.imageKey)
            .catch((e) =>
              console.error(
                `მუსიკის ფაილის წაშლის შეცდომა ${music.imageKey}:`,
                e,
              ),
            );
        }
      }
    }

    // 3. წავშალოთ ალბომის ფოტო AWS S3-დან
    if (album.imageKey) {
      await this.s3service
        .deleteFile(album.imageKey)
        .catch((e) =>
          console.error(`ალბომის ფოტოს წაშლის შეცდომა ${album.imageKey}:`, e),
        );
    }

    // 4. წავშალოთ ყველა მუსიკა ბაზიდან (თუ კასკადი არ მუშაობს)
    if (album.musics && album.musics.length > 0) {
      await this.repository.manager.remove(album.musics);
    }

    // 5. წავშალოთ თავად ალბომი ბაზიდან
    await this.repository.remove(album);
  }
}
