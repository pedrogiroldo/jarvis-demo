import { Controller, Get, Header } from '@nestjs/common';
import { ChefService } from './chef.service';

@Controller('chef')
export class ChefController {
  constructor(private readonly chefService: ChefService) {}

  @Get()
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getChef() {
    const count = await this.chefService.getChefCount();
    return { count };
  }
}
