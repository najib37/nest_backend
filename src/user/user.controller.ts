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
  ValidationPipe, Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { FormatedQueryType, QueryTypedto } from './dto/query-validation.dto';
import { ParseQueryPipe } from './parse-query/parse-query.pipe';
import { AuthReq } from './types/AuthReq'

@Controller('user')

@UseFilters(PrismaErrorsFilter)
@UseGuards(JwtGuard) // call back cookie google haitam

export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('/lot/') // debug
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createMany(createUserDto);
  }

  @Post() //debug
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto);
  }

  @Get('/all/')
  findAll(
    @Query(
      new ValidationPipe({
        expectedType: QueryTypedto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
      ParseQueryPipe
    ) { paginationQueries, searchQueries }: FormatedQueryType,
  ) {
    console.log("recieved a request");
    return this.userService.findAll(paginationQueries);
  }

  @Get('/search/')
  async searchUsers(
    @Query(
      new ValidationPipe({
        expectedType: QueryTypedto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
      ParseQueryPipe
    ) { paginationQueries }: FormatedQueryType,
    @Query('username') username?: string,
  ) {
    // console.log("recieved request");
    const users = await this.userService.searchForUsers(paginationQueries, username);
    console.log(users);
    return users;
  }


  @Get()
  getLoggedUser(@Req() req: AuthReq) {
    console.log("user request");

    // setTimeout(() => {
    //   return this.userService.findOne(req.user.sub || '');
    // }, 100000)
    return this.userService.findOne(req.user.sub || '');
    // throw InternalServerErrorException;
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) userId: string,
    @Req() req: AuthReq,
  ) {

    if (!userId) return {};

    return this.userService.findOne(userId);
  }

  @Patch()
  update(
    @Req() req: AuthReq,
    @Body(
      new ValidationPipe({
        expectedType: UpdateUserDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    ) updateUserDto: UpdateUserDto
  ) {
    const id = req.user?.sub;
    if (!id)
      return {};
    console.log("patch id = ", id)
    // console.log(id);
    return this.userService.update(id, updateUserDto);
  } // not competed yet

  @Delete("/all/") // this is very scufed so dont use it debug
  truncate() { // dev needs to be deleted
    return this.userService.truncate();
  }


  @Delete()
  remove(@Req() req: AuthReq) {
    const id = req.user.sub;
    return this.userService.remove(id);
  }
}
