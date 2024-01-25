import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StateType } from './types/StateType';
import { Notification } from './entities/notification.entity'

@Injectable()
export class NotificationService {

  constructor(
    private readonly prisma: PrismaService
  ) {}
  create(userId: string, createNotificationDto: CreateNotificationDto) : Promise<Notification>{
    return this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        state: 'PENDING',
        // ownerId: userId
      }
    })
  }

  findByState(userId: string, state: StateType): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        state,
        // ownerId: userId,
      }
    });
  }

  findOne(userId: string, notifId: string) : Promise<Notification>{
    return this.prisma.notification.findUnique({
      where: {
        id: notifId,
        // ownerId: userId,
      }
    });
  }

  update(userId: string, notifId: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>{
    return this.prisma.notification.update({
      where: {
        id: notifId,
        // ownerId: userId,
      },
      data: updateNotificationDto,
    });
  }

  remove(userId: string, notifId: string) : Promise<Notification>{
    return this.prisma.notification.delete({
      where: {
        id: notifId,
        // ownerId: userId
      },
    });
  }
}
