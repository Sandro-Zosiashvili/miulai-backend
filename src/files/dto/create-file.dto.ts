import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Injectable()
export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  // @IsUrl()

  @IsString()
  @IsNotEmpty()
  url: string;
}
