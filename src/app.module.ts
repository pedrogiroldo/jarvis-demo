import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioModule } from './audio/audio.module';
import { AgentModule } from './agent/agent.module';
import { PrismaModule } from './prisma/prisma.module';
import { FrontendModule } from './frontend/frontend.module';
import { ChefModule } from './chef/chef.module';
import { DriverModule } from './driver/driver.module';

@Module({
  imports: [
    AudioModule,
    AgentModule,
    PrismaModule,
    FrontendModule,
    ChefModule,
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
