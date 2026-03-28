import { Controller, Get, Post, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Character } from './character.entity';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() characterData: any, @Request() req) {
    return this.charactersService.create(req.user.id, characterData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByUser(@Request() req) {
    return this.charactersService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.charactersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.charactersService.update(id, updateData);
  }
}
