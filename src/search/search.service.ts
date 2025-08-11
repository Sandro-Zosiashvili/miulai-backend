import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
  constructor(private readonly repository: SearchRepository) {}

  create(createSearchDto: CreateSearchDto) {
    return 'This action adds a new search';
  }

  async globalSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        music: [],
        authors: [],
        albums: [],
      };
    }

    return this.repository.globalSearch(searchTerm.trim());
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
