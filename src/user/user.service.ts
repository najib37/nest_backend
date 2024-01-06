import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {


  constructor(private prisma : PrismaService) { }
  async create(data: CreateUserDto) : Promise<User> {
    return await this.prisma.user.create({data,})
  }

  async findAll() : Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async findOne(id: number) : Promise<User> {
    const user = await this.prisma.user.findFirst({where : {id}})
    console.log('find one called', user)
    return user
  }

  async update(id: number, data: UpdateUserDto) : Promise<User> {
    return await this.prisma.user.update({where : {id}, data})
  }

  async findOrCreateUser(data : {username : string,
    Avatar : string, email : string, name : string}) : Promise<User> {
    let user = await this.prisma.user.findFirst({where : {email : data.email}}) 
    if (user)
    {
      user =  await this.prisma.user.update({where : {id : user.id}, data})
      return user;
    }
    user = await this.prisma.user.create({data});
    return user;
  }
  
  async remove(id: number) : Promise<User>{
    return this.prisma.user.delete({where : {id}});
  }
}
