import { Controller, Get, Header } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('chef')
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getChef() {
    const chef = await this.agentService['prismaService'].chef.findFirst();
    return { count: chef?.count || 0 };
  }

  @Get('driver')
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getDriver() {
    const driver = await this.agentService['prismaService'].driver.findFirst();
    return { count: driver?.count || 0 };
  }
}
