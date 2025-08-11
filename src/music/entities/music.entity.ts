import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../../album/entities/album.entity';
import { Author } from '../../author/entities/author.entity';
import { Playlist } from '../../playlists/entities/playlist.entity';

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', nullable: false })
  authorId: number;

  @Column({ type: 'varchar', length: 100 })
  artistName: string;

  @Column({ type: 'int', nullable: true })
  albumId: number;

  // @Column({ type: 'varchar', length: 100 })
  // albumName: string;

  // @Column({ type: 'text', nullable: false })
  // albumCover: string;

  @Column({ type: 'varchar', length: 100 })
  imageKey: string;

  @Column({ type: 'text', nullable: false })
  music: string;

  @ManyToOne(() => Album, (album) => album.musics)
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @ManyToOne(() => Author, (author) => author.musics)
  author: Author;

  @ManyToMany(() => Playlist, (playlist) => playlist.musics)
  playlists: Playlist[];

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true })
  playCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
