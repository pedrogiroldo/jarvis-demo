import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AgentController } from './agent.controller';
import { ChefModule } from 'src/chef/chef.module';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports: [PrismaModule, ChefModule, DriverModule],
  providers: [AgentService],
  exports: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
