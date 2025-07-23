import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  artistName: string;

  @IsString()
  @IsNotEmpty()
  artistPhoto: string;

  @IsString()
  @IsNotEmpty()
  artistBiography: string;
}
