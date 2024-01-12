import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
    private logger: Logger = new Logger(UserService.name)
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    let user: User;

    try {
      user = await this.prisma.user.create(
        { data }
      )
    } catch(err) {
      this.logger.fatal(`USER: ERROR CREATING USER`)
      // this.logger.error(err)
      // throw new HttpException({
      //   status: HttpStatus.FORBIDDEN,
      //   error: 'This is a custom message',
      // }, HttpStatus.FORBIDDEN, {
      //   cause: "ana"
      // });
    }
    return user;
  }

  async createMany(data: CreateUserDto[]): Promise<User[]> { // debug
    let user;

    try {
      user = await this.prisma.user.createMany(
        { data }
      )
    } catch {
      // console.log(err);
      this.logger.fatal(`USER: ERROR CREATING USER here`)
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    let users: User[];

    try {
      users = await this.prisma.user.findMany()
    } catch {
      this.logger.fatal(`USER: ERROR FINDING USERS`)
    }

    console.log("user = ", users);
    return users;
  }

  async findOne(id: string): Promise<User> {
    let user: User;

    try {
      user = await this.prisma.user.findUnique(
        {
          where: {
            id,
          },
        }
      )
    } catch {
      this.logger.fatal(`USER: ERROR FINDING USER`)
    }
    return user
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    let user: User;

    try {
      user = await this.prisma.user.update(
        {
          where: {
            id,
          },
          data,
        }
      )
    } catch(err) {
      console.log(err)
      this.logger.fatal(`USER: ERROR UPDATING USER`)
    }
    return user;
  }

  async findOrCreateUser(
    data: { username: string, avatar: string, email: string, name: string; }
  ): Promise<User> {
    let user;

    try {
      user = this.prisma.user.upsert({
        where: {
          email: data.email,
        },
        update: {
          ...data
        },
        create: {
          ...data
        }
      })
    } catch {
      this.logger.fatal(`USER: ERROR UPDATING USER DATA`);
    }
    // Prisma.Cl
    this.logger.debug(data); // debug !
    this.logger.debug(user);
    return user;
  }

  async remove(id: string): Promise<User> {
    try {
      return this.prisma.user.delete({
        where: {
          id,
        },
      })
    } catch {
      this.logger.fatal(`USER: ERROR DELETING USER DATA`);


    }
  }
  async truncate(): Promise<any> { // debug
    return this.prisma.user.deleteMany(); // debug only
  }
}
