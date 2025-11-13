import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports: [ConfigModule, AgentModule],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
