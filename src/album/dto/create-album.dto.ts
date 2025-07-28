import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Injectable()
export class CreateAlbumDto {
  @IsNotEmpty()
  authorId: number;

  @IsString()
  @IsNotEmpty()
  albumName: string;

  @IsString()
  @IsNotEmpty()
  artistName: string;

  // @IsString()
  // @IsNotEmpty()
  // albumImage: string;

  @IsString()
  @IsNotEmpty()
  releaseDate: string;
}
