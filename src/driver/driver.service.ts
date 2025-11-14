import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DriverService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDriverCount(): Promise<number> {
    const driver = await this.prismaService.driver.findFirst();
    return driver?.count || 0;
  }

  async incrementDriverCount() {
    const driver = await this.prismaService.driver.findFirst();
    if (driver) {
      await this.prismaService.driver.update({
        where: { id: driver.id },
        data: { count: driver.count + 1 },
      });
    } else {
      await this.prismaService.driver.create({ data: { count: 1 } });
    }
  }
}
