import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';

@Injectable()

export class UserService {

  constructor(
    private prisma: PrismaService,
    private logger: Logger = new Logger(UserService.name)
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create(
      { data }
    )
  }

  async createMany(data: CreateUserDto[]): Promise<any> { // debug
    return this.prisma.user.createMany(
      { data }
    )
  }

  async findAll(): Promise<User[]> {
    let users: User[];

    return this.prisma.user.findMany()
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique(
      {
        where: {
          id,
        },
      }
    )
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update(
      {
        where: {
          id,
        },
        data,
      }
    )
  }

  async findOrCreateUser(
    data: { username: string, avatar: string, email: string, name: string; }
  ): Promise<User> {
    return  this.prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        ...data
      },
      create: {
        ...data
      }
    })
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async truncate(): Promise<any> { // debug
    return this.prisma.user.deleteMany(); // debug only
  }
}
