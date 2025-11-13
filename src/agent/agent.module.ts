import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AgentController } from './agent.controller';

@Module({
  imports: [PrismaModule],
  providers: [AgentService],
  exports: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
