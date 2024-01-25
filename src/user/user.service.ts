import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { SelectUser } from './entities/user-allowed-fields.entity';
import { FormatedQueryType } from './dto/query-validation.dto';

@Injectable()

export class UserService {

  private selectUser: SelectUser = new SelectUser

  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create(
      {
        data,
      }
    )
  }

  async createMany(data: CreateUserDto[]): Promise<any> { // debug
    return this.prisma.user.createMany(
      { data }
    )
  }

  async findAll(query?: FormatedQueryType): Promise<User[]> {
    return this.prisma.user.findMany({
      select: { ...this.selectUser },
      ...query
    })
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique(
      {
        where: { id },
        select: { ...this.selectUser },
      },
    )
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update(
      {
        where: {
          id,
        },
        data,
        select: { ...this.selectUser }
      }
    )
  }

  async findOrCreateUser(
    data: { username: string, avatar: string, email: string, name: string; }
  ): Promise<User> {
    return this.prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        ...data
      },
      create: {
        ...data
      },
      select: { ...this.selectUser }
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

  async addFriend(userId: string, friendId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId
          }
        }
      },
      select: {
        ...this.selectUser
      }
    })
  }

  async deleteFriend(userId: string, friendId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId
          }
        }
      },
      select: {
        ...this.selectUser
      }
    })
  }

  async getAllFriends(userId: string, query: FormatedQueryType) : Promise<User>{
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        friends: {
          select: {
            ...this.selectUser
          },
          ...query
        }
      },
    })
  }

}
