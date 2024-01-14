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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { FormatedQueryType, QueryTypedto } from './dto/query-validation.dto';
import { ParseQueryPipe } from './parse-query/parse-query.pipe';

@Controller('user')

@UseFilters(PrismaErrorsFilter)
@UseGuards(JwtGuard)

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/lot')
  // @UseGuards(JwtGuard)
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createMany(createUserDto);
  }

  // @UseGuards(JwtGuard)
  // @UseGuards(JwtGuard)
  @Post('')
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto);
  }

  @Get('/all/')
  // @UseGuards(JwtGuard)
  findAll(
    @Query(new ValidationPipe({ expectedType: QueryTypedto }), ParseQueryPipe) query?: FormatedQueryType
  ) {
    return this.userService.findAll(query);
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
    @Param('id',ParseUUIDPipe) friendId: string,
  ) {
    console.log(req.user.sub);
    return this.userService.addFriend(req.user.sub, friendId);
  }

  @Post('/friends/add/:id')
  deleteFriend(
    @Req() req,
    @Param('id',ParseUUIDPipe) friendId: string,
  ) {
    console.log(req.user.sub);
    return this.userService.deleteFriend(req.user.sub, friendId);
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
