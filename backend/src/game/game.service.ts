import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  async getServerStatus(): Promise<any> {
    return {
      status: 'online',
      players: 0,
      version: '1.0.0',
    };
  }
}
