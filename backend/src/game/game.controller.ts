import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('status')
  async getServerStatus() {
    return this.gameService.getServerStatus();
  }
}
