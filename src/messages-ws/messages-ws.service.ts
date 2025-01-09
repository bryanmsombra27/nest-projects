import { Injectable } from '@nestjs/common';
import { SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { newMessageDto } from './dto/newMessage.dto';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, id: string) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) throw new Error(`user not found`);
    if (!user.isActive) throw new Error(`user not active`);

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(id: string) {
    delete this.connectedClients[id];
  }

  getTotalConnections(): string[] {
    return Object.keys(this.connectedClients);
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: newMessageDto) {
    // client.emit('message-from-server', {
    //   fullName: 'koso',
    //   msg: payload.msg || 'no message',
    // });

    // emitir a todos menos a quien lo envio originalmente
    client.broadcast.emit('message-from-server', {
      fullName: this.getUserFullName(client.id),
      msg: payload.msg || 'no message',
    });
  }

  getUserFullName(id: string) {
    return this.connectedClients[id].user.fullName;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id == user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
