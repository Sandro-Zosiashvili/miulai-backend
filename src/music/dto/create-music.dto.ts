import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMusicDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  authorId: number;

  @IsNotEmpty()
  artistName: string;

  // @Type(() => Number)
  @Type(() => Number)
  @IsNotEmpty()
  albumId: number;

  // @IsString()
  // albumName: string;
  //
  // @IsString()
  // albumCover?: string;

  // @IsOptional()
  // duration?: number;
}
