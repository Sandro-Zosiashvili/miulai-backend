import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserRepository } from '../user/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async userLogin(data: CreateAuthDto) {
    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const jwtToken = await this.jwtService.signAsync(payload);

    console.log('jwtToken', jwtToken);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: jwtToken,
    };
  }
}
