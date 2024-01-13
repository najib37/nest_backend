import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseFilters,
  UseGuards,
  ParseIntPipe,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { QueryTypedto } from './dto/query-validation.dto';
import { ParseQueryPipe } from './parse-query/parse-query.pipe';

// import { QueryType } from './types/QuereyType';

@Controller('user')

@UseFilters(PrismaErrorsFilter)

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/lot')
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createMany(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/all/')
  // @UsePipes()
  findAll(
    @Query(ValidationPipe, ParseQueryPipe ) query?: QueryTypedto
  ) {
    // console.log("hello");
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req,
    @Query() query: QueryTypedto
  ) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  } // not competed yet

  @Delete("/all") // this is very scufed so dont use it debug
  truncate() { // dev needs to be deleted
    return this.userService.truncate();
  }

  @Delete(':id') 
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.userService.remove(id);
  }
}
