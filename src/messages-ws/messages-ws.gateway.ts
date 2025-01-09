import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({
  cors: true,
})
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // DECORADOR PARA SOCKET SERVER
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  handleDisconnect(client: Socket) {
    // throw new Error('Method not implemented.');
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getTotalConnections(),
    );
  }
  async handleConnection(client: Socket, ...args: any[]) {
    // throw new Error('Method not implemented.');
    const token = client.handshake.headers.authorization.split(' ')[1];

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getTotalConnections(),
    );

    // this.messagesWsService.removeClient(client.id);
  }
}
