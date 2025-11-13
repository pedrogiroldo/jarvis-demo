import { Controller, Get } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('chef')
  async getChef() {
    // Retorna o primeiro registro de chef
    return this.agentService['prismaService'].chef.findFirst();
  }

  @Get('driver')
  async getDriver() {
    // Retorna o primeiro registro de driver
    return this.agentService['prismaService'].driver.findFirst();
  }
}
