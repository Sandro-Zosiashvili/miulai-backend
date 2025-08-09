import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (!(createUserDto.password === createUserDto.RepeatPassword)) {
      throw new UnauthorizedException('Passwords do not match');
    }

    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.password = hash;

    return this.repository.save(newUser);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
