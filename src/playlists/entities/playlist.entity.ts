import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Music } from '../../music/entities/music.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @ManyToMany(() => MusicEntity, (music) => music.playlists)
  // @JoinTable({ name: 'playlist_music' })
  // musics: MusicEntity[];

  @Column({ type: 'int', nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;

  @ManyToMany(() => Music, (music) => music.playlists)
  @JoinTable()
  musics: Music[];

  // @OneToMany(() => FileEntity, (file) => file.playlist)
  // files: FileEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
