import { Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Post, Query, Req, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ParseQueryPipe } from 'src/user/parse-query/parse-query.pipe';
import { FormatedQueryType, QueryTypedto } from 'src/user/dto/query-validation.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { AuthReq } from 'src/user/types/AuthReq';

@Controller('friends')
@UseFilters(PrismaErrorsFilter)
@UseGuards(JwtGuard)
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly userService: UserService,
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Get('/all')
  getAllFriends(
    @Req() req : AuthReq,
    @Query(
      new ValidationPipe({ expectedType: QueryTypedto }),
      ParseQueryPipe
    ) { paginationQueries }: FormatedQueryType
  ) {
    console.log(req.user.sub);
    return this.friendsService.getAllFriends(req.user.sub, paginationQueries);
  }

  @Post('/add/:id')
  addFriend(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) friendId: string,
  ) {
    return this.friendsService.addFriend(req.user.sub, friendId);
  }

  @Post('/delete/:id')
  deleteFriend(
    @Req() req: AuthReq,
    @Param('id', ParseUUIDPipe) friendId: string,
  ) {
    return this.friendsService.deleteFriend(req.user.sub, friendId);
  }

  @Post('/request/:id')
  async sendRequest(
    @Param('id', ParseUUIDPipe) recipientId : string,
    @Req() req: AuthReq,
  ) {
    const notifState = await this.notificationGateway.sendNotification(
      'User',
      `Friend Request From ${req.user.username}`,
      req.user.sub,
      recipientId
    )

    if (!notifState)
      return InternalServerErrorException;

    return {
      message: "Request Sent Successfully"
    }
  }
}
