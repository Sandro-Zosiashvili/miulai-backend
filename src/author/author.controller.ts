import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles, UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photo' }, { name: 'cover' }]),
  )
  create(
    @Body() createAuthorDto: CreateAuthorDto,
    @UploadedFiles()
    files: { photo?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    const photo = files.photo?.[0]; // პირველი ფაილი photo სახელით
    const cover = files.cover?.[0]; // პირველი ფაილი cover სახელით

    console.log(photo, cover);
    if (!photo) throw new Error('Photo is required');
    if (!cover) throw new Error('Cover is required');

    return this.authorService.create(createAuthorDto, photo, cover);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }

  @Get(':id/top-songs')
  getTopSongs(@Param('id') authorId: number) {
    return this.authorService.getTopSongs(authorId);
  }
}
