import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as fs from 'fs';
import { AudioService } from './audio.service';
import { ValidateAudioFilePipe } from './pipes/validate-audio-file.pipe';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file'))
  async transcribe(
    @UploadedFile(ValidateAudioFilePipe)
    file: Express.Multer.File,
    @Res() res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const tmpPath = (file as any).tmpPath as string;

    try {
      const result = await this.audioService.transcribeAudio(tmpPath);
      return res.json(result);
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  }
}
