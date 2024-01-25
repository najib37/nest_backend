import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UseGuards } from '@nestjs/common';
// import { SocketJwtGuard } from 'src/auth/guard/socketJwt.guards';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { SocketJwtGuard } from 'src/auth/guard/socketJwt.guards';


@WebSocketGateway({ namespace: 'notification', cors: true })
@UseGuards(SocketJwtGuard)
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {

  public connectedSockets :Record<string, Socket> = {}

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {
  }

  async handleConnection(client: Socket) {
    // this.connectedSockets['hharik'] = client;
  }

  handleDisconnect() {
    delete this.connectedSockets['hharik'];
    console.log('notification Client disconnected');
    // return "hi from server";
  }

  @SubscribeMessage('notification')
  updateNotif(@MessageBody() notif: CreateNotificationDto) {
    
    if (notif.state === 'CLICKED')
      this.notificationService.remove('sd', notif.id);
    else if (notif.state === 'READ')
      this.notificationService.update('xxxx', notif.id, {state: 'READ'})
    // return this.userService.findAll();
  }

  @SubscribeMessage('allPendingNotification')
  async sendPending(client: Socket) {
    const notifs = await this.notificationService.findByState('sdc', 'PENDING')
    console.log(notifs);
  }

  async sendNotification(type: NotifOriginType, content: string) {
    // console.log("notification gateway");
    const notif = await this.notificationService.create('', {
      type,
      content,
      state: 'PENDING'
    })
    
    console.log(notif);
    this.server.emit("notification", JSON.stringify({ type: type, content: content }))
  }
}

    // console.log('notification Client connected');
    // let a = 0;
    // setInterval(() => {
    //   client.emit('notification', {
    //     id: "xmxmxjsnsghsmdhdgewwshsgh",
    //     type: 'friendRequest',
    //     content: "haitam server sent",
    //     state: "PENDING"
    //   });
    //   console.log("sent num = ", a);
    //   a++;
    // }, 5000)
