import { Injectable } from '@nestjs/common';
const gameData = require('../../../shared/game-data.json');

@Injectable()
export class ItemsService {
  async getItems(): Promise<any[]> {
    return gameData.items.items;
  }

  async getItem(id: string): Promise<any> {
    return gameData.items.items.find((i: any) => i.id === id);
  }
}
