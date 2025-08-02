import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Album } from '../../album/entities/album.entity';
import { Music } from '../../music/entities/music.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  artistName: string;

  // @Column({ type: 'varchar', length: 100, nullable: false })
  @Column({ type: 'text', nullable: false })
  artistPhoto: string;

  @Column({ type: 'varchar', length: 700, nullable: false })
  artistBiography: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  imageKey: string;

  @OneToMany(() => Album, (album) => album.author, { cascade: true })
  albums: Album[];

  @OneToMany(() => Music, (music) => music.author, { cascade: true })
  musics: Music[];

  @Column({ type: 'varchar', nullable: false })
  artistCover: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  artistCoverKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
