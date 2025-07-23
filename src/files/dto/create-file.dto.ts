import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Injectable()
export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  key: string;

  @IsString()
  bucket: string;

}
