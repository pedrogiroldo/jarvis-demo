import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
