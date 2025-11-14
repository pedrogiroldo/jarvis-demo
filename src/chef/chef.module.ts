import { Module } from '@nestjs/common';
import { ChefService } from './chef.service';
import { ChefController } from './chef.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ChefService],
  controllers: [ChefController],
  exports: [ChefService],
})
export class ChefModule {}
