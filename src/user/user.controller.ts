import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { PARAMTYPES_METADATA } from '@nestjs/common/constants';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { AuthGuard } from '@nestjs/passport';

type QueryType = {
  [key: string]: string[],
}

@Controller('user')
// @UseFilters(PrismaErrorsFilter)
// @UseFilters(PrismaErrorsFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/lot')
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createMany(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    console.log("body = " , createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get('/all')
  findAll() {
    // throw n;
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string,  @Req() req, @Query() query?: QueryType) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  } // not competed yet

  @Delete("/all") // this is very scufed so dont use it debug
  truncate() { // dev needs to be deleted
    return this.userService.truncate();
  }

  @Delete(':id') 
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
