// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Ajusta esto según tus necesidades
  },
})
export class QrudGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('test')
  handleMessage(@MessageBody() data: any): void {
    console.log('Mensaje recibido:', data);
    this.server.emit('test-response', { texto: 'Hola desde el servidor!' }); // broadcast
  }

  updateRolPermissions(@MessageBody() data: any) {
    console.log('Actualizando permisos de rol:', data);
    this.server.emit('updateRolPermissions', data);
  }

  // Puedes acceder a los eventos de conexión y desconexión
  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);
  }
}
