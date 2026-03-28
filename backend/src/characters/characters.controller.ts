import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Character, CharacterClass, CharacterRace, Faction } from './character.entity';

class CreateCharacterDto {
  name: string;
  class: CharacterClass;
  race: CharacterRace;
}

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto, @Request() req) {
    return this.charactersService.create({
      ...createCharacterDto,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req, @Query('all') all: string) {
    if (all === 'true' && req.user.role === 'admin') {
      return this.charactersService.findAll();
    }
    return this.charactersService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCharacterDto: Partial<Character>) {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.charactersService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/experience')
  addExperience(@Param('id') id: string, @Body() body: { experience: number }) {
    return this.charactersService.addExperience(+id, body.experience);
  }
}
