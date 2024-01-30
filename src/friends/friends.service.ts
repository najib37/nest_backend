import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FormatedQueryType, PaginationQueryType } from 'src/user/dto/query-validation.dto';
import { SelectUser } from 'src/user/entities/user-allowed-fields.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FriendsService {

  private selectUser: SelectUser = new SelectUser

  constructor(
    private readonly prisma: PrismaService
  ) { }

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

  async getAllFriends(userId: string, paginationQueries:PaginationQueryType ): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        friends: {
          select: {
            ...this.selectUser
          },
          ...paginationQueries
        }
      },
    })
  }
}
