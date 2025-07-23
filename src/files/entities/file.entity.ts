import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Files' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fileName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  key: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bucket: string;
}
