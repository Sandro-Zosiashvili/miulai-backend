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
    newUser.name = createUserDto.name;
    newUser.password = hash;

    return this.repository.save(newUser);
  }

  async findOne(id: number) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isAdmin, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async findUserWithPlaylists(userId: number) {
    return this.repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email'])
      .leftJoinAndSelect('user.playlists', 'playlists')
      .where('user.id = :id', { id: userId })
      .getOne();
  }
}
