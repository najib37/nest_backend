import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
    private logger: Logger = new Logger(UserService.name)
  ) { }

  async create(data: CreateUserDto): Promise<any> {
    let user: any;

    try {
      user = await this.prisma.user.createMany(
        { data }
      )
    } catch {
      this.logger.fatal(`USER: ERROR CREATING USER`)
    }

    return user;
  }

  async findAll(): Promise<any[]> {
    let users: any[];

    try {
      users = await this.prisma.user.findMany()
    } catch {
      this.logger.fatal(`USER: ERROR FINDING USERS`)
    }

    return users;
  }

  async findOne(id: string): Promise<any> {
    let user: any;

    try {
      user = await this.prisma.user.findUnique(
        {
          where: {
            id,
          },
        }
      )
    } catch {
      this.logger.fatal(`USER: ERROR FINDING USER`)
    }
    return user
  }

  async update(id: string, data: UpdateUserDto): Promise<any> {
    let user: any;

    try {
      user = await this.prisma.user.update(
        {
          where: {
            id,
          },
          data,
        }
      )
    } catch {
      this.logger.fatal(`USER: ERROR UPDATING USER`)
    }
    return user;
  }

  async findOrCreateUser(
    data: { username: string, Avatar: string, email: string, name: string; }
  ): Promise<any> {
    let user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    })
    if (user) {
      user = await this.prisma.user.update({ where: { id: user.id }, data })
      return user;
    }
    user = await this.prisma.user.create({ data });
    return user;
  }

  async remove(id: string): Promise<any> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
  async truncate(): Promise<any> {
    return this.prisma.user.deleteMany();
  }
}
