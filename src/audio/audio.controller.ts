import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { AudioService } from './audio.service';
import { ValidateAudioFilePipe } from './pipes/validate-audio-file.pipe';
import { TranscribeResponseDto } from './dto/transcribe-response.dto';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file'))
  async transcribe(
    @UploadedFile(ValidateAudioFilePipe)
    file: Express.Multer.File,
  ): Promise<TranscribeResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const tmpPath = (file as any).tmpPath as string;

    try {
      const result = await this.audioService.transcribeAudio(tmpPath);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro ao transcrever o áudio',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  }
}
