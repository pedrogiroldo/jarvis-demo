import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioModule } from './audio/audio.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [AudioModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
