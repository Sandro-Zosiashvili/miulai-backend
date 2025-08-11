import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { NotFoundException } from '@nestjs/common';
import { Music } from '../music/entities/music.entity';
import { S3Service } from '../aws/services/s3.service';

@Injectable()
export class PlaylistsRepository {
  constructor(
    @InjectRepository(Playlist)
    private readonly repository: Repository<Playlist>,
    @InjectRepository(Music)
    private readonly MusicRepository: Repository<Music>,
    private readonly s3Service: S3Service, // ეს ვერ არის დაფარული DI-ში
  ) {}

  create(createPlaylistDto: CreatePlaylistDto) {
    const newPlaylist = this.repository.create(createPlaylistDto);
    return this.repository.save(newPlaylist);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const playlist = await this.repository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.musics', 'music')
      .leftJoinAndSelect('music.album', 'album')
      .where('playlist.id = :id', { id })
      .getOne();

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // Generate fresh presigned URLs for each music and album image
    if (playlist.musics && playlist.musics.length > 0) {
      playlist.musics = await Promise.all(
        playlist.musics.map(async (music) => {
          // Generate presigned URL for the music file
          if (music.imageKey) {
            music.music = await this.s3Service.getPresignedUrl(music.imageKey);
          }

          // Generate presigned URL for the album image
          if (music.album?.imageKey) {
            music.album.albumImage = await this.s3Service.getPresignedUrl(
              music.album.imageKey,
            );
          }

          return music;
        }),
      );
    }

    return playlist;
  }

  async remove(id: number) {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Playlist)
      .where('id = :id', { id })
      .execute();

    return result;
  }

  async addMusicToPlaylist(playlistId: number, musicId: number) {
    // 1. იპოვე პლეილისტი
    const playlist = await this.repository.findOne({
      where: { id: playlistId },
      relations: ['musics'], // ჩატვირთე დაკავშირებული მუსიკები
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    // 2. იპოვე მუსიკა
    const music = await this.MusicRepository.findOneBy({ id: musicId });
    if (!music) throw new NotFoundException('Music not found');

    // 3. დაამატე მუსიკა პლეილისტში
    playlist.musics.push(music);

    // 4. შეინახე ცვლილებები
    return this.repository.save(playlist);
  }
}
