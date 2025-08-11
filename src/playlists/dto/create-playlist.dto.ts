import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

@Injectable()
export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
