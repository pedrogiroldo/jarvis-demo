import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChefService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChefCount(): Promise<number> {
    const chef = await this.prismaService.chef.findFirst();
    return chef?.count || 0;
  }

  async incrementChefCount() {
    const chef = await this.prismaService.chef.findFirst();
    if (chef) {
      await this.prismaService.chef.update({
        where: { id: chef.id },
        data: { count: chef.count + 1 },
      });
    } else {
      await this.prismaService.chef.create({ data: { count: 1 } });
    }
  }
}
