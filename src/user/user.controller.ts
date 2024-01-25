import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { FormatedQueryType, QueryTypedto } from './dto/query-validation.dto';
import { ParseQueryPipe } from './parse-query/parse-query.pipe';
import { Response } from 'express';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Controller('user')

@UseFilters(PrismaErrorsFilter)
@UseGuards(JwtGuard)

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notification: NotificationGateway
  ) { }

  @Post('/lot')
  // @UseGuards(JwtGuard)
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createMany(createUserDto);
  }

  // @UseGuards(JwtGuard)
  @Post('')
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto);
  }

  @Get('/all/')
  // @UseGuards(JwtGuard)
  async findAll(
    @Res() res: Response,
    @Query(new ValidationPipe({ expectedType: QueryTypedto }), ParseQueryPipe) query?: FormatedQueryType,
  ) {
    console.log("recieved a request");
    // setTimeout(async () => {
      const users = await this.userService.findAll(query);
      res.status(201).json(users);
    // }, 10000)
    // return 
  }

  @Get(':id')
  // @UseGuards(JwtGuard)
  findOne(
    @Param('id') id: string,
  ) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  } // not competed yet

  @Delete("/all/") // this is very scufed so dont use it debug
  truncate() { // dev needs to be deleted
    return this.userService.truncate();
  }

  @Delete(':id')
  // @UseGuards(JwtGuard)
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.userService.remove(id);
  }

  // >>>>>> frinds routes
  // @UseGuards(JwtGuard)
  @Post('/friends/add/:id')
  addFriend(
    @Req() req,
    @Param('id', ParseUUIDPipe) friendId: string,
  ) {
    return this.userService.addFriend(req.user.sub, friendId);
  }

  @Post('/friends/add/:id')
  deleteFriend(
    @Req() req,
    @Param('id', ParseUUIDPipe) friendId: string,
  ) {
    return this.userService.deleteFriend(req.user.sub, friendId);
  }
  @Get('/friends/request/')
  sendRequest() {

    // const reci = this.userService.findOne('') // find the reciepient
    console.log("got here");
    this.notification.sendNotification('User', "not Implemented")
    return "request sent"
  }

  // @UseGuards(JwtGuard)
  @Get('/friends/all')
  getAllFriends(
    @Req() req,
    @Query(new ValidationPipe({ expectedType: QueryTypedto }), ParseQueryPipe) query?: FormatedQueryType
  ) {

    console.log(req.user.sub);
    return this.userService.getAllFriends(req.user.sub, query);
  }
}
