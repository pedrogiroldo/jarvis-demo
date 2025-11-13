import { Controller, Get, Res } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import type { Response } from 'express';
import * as path from 'path';

@Controller()
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}

  @Get()
  serveIndex(@Res() res: Response) {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html'));
  }
}
