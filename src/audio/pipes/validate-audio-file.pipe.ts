import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as mp3Duration from 'mp3-duration';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface AudioFileExt extends Express.Multer.File {
  tmpPath?: string;
}

@Injectable()
export class ValidateAudioFilePipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<AudioFileExt> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi fornecido');
    }

    // Validar tipo MIME
    if (file.mimetype !== 'audio/mpeg' && file.mimetype !== 'audio/mp3') {
      throw new BadRequestException('Apenas arquivos MP3 são aceitos');
    }

    // Validar duração do áudio
    const tmpPath = path.join(os.tmpdir(), `audio_${Date.now()}.mp3`);
    fs.writeFileSync(tmpPath, file.buffer);

    try {
      const duration = await this.getAudioDuration(tmpPath);

      if (duration > 20) {
        fs.unlinkSync(tmpPath);
        throw new BadRequestException('O áudio deve ter no máximo 20 segundos');
      }

      // Guardar o caminho temporário no objeto file para posterior uso
      const extendedFile = file as AudioFileExt;
      extendedFile.tmpPath = tmpPath;

      return extendedFile;
    } catch (error) {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao processar o arquivo de áudio');
    }
  }

  private async getAudioDuration(filePath: string): Promise<number> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const duration: number = await (mp3Duration as any)(filePath);
      return duration;
    } catch {
      throw new Error('Falha ao obter duração do áudio');
    }
  }
}
