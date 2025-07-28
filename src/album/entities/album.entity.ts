import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from '../../author/entities/author.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  authorId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  albumName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  artistName: string;

  @Column({ type: 'text', nullable: false })
  albumImage: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  imageKey: string;

  @ManyToOne(() => Author, (author) => author.albums)
  author: Author;

  @Column({ type: 'date', nullable: false })
  releaseDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
