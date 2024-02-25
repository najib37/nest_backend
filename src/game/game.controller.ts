import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

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

  @Post()
  postGameForTest(
    @Body(ValidationPipe) game
  ) {
    console.log(game);
    return this.gameService.create(game);
  }

  @Delete('id')
  deleteGame() {
  }
}
