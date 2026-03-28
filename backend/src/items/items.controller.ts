import { Controller, Get, Param } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  async getItems() {
    return this.itemsService.getItems();
  }

  @Get(':id')
  async getItem(@Param('id') id: string) {
    return this.itemsService.getItem(id);
  }
}
