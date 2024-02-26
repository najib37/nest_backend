import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseUUIDPipe, Post, Req, UseFilters, ValidationPipe } from '@nestjs/common';
import { GameService } from './game.service';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { AuthReq } from 'src/user/types/AuthReq';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';

@UseFilters(PrismaErrorsFilter)
@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
  ) { }

  @Get()
  getAllGames() {
    return this.gameService.getAllGame();
  }

  @Get(':id')
  getGameById(
    @Param('id') id: string
  ) {
    return this.gameService.getGameById(id);
  }

  @Post() // WARN: debug
  postGameForTest(
    @Body(ValidationPipe) game
  ) {
    console.log(game);
    return this.gameService.create(game);
  }

  @Delete('id')
  deleteGame(@Param('id', ParseUUIDPipe) id: string) {
    return this.gameService.remove(id);
  }

  @Post('ser') // WARN: debug
  ser(@Body() body) {
    return this.gameService.serelize(body);
  }

  @Post('/request/:id')
  async sendRequest(
    @Param('id', ParseUUIDPipe) recipientId: string,
    @Req() req: AuthReq,
  ) {
    const notifState = await this.notificationGateway.sendNotification(
      'Game',
      `Game Request From ${req.user.username}`,
      req.user.sub,
      recipientId
    )

    if (!notifState)
      return InternalServerErrorException;

    return {
      message: "Request Sent Successfully"
    }
  }

  @Get('/request/:id')
  async getRequest(
    @Param('id', ParseUUIDPipe) sendertId: string,
    @Req() req: AuthReq,
  ) {
    const request = await this.notificationService.findByRerecipient(sendertId, req.user.sub, "Game");

    return request;
  }

  @Delete('/request/:id')
  async deleteFriendRequest(
    @Param('id', ParseUUIDPipe) sendertId: string,
    @Req() req: AuthReq,
  ) {

    const notif = await this.notificationService.findByRerecipient(sendertId, req.user.sub, "Game");

    if (!notif)
      return {
        message: "Unable To Deleted Game Request"
      }

    await this.notificationService.remove(notif.id);

    return {
      message: "Game Request Deleted Successfully"
    };
  }
}
