import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../../album/entities/album.entity';

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

  @Column({ nullable: true })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
