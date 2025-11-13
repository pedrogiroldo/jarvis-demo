import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface AudioFileExt extends Express.Multer.File {
  tmpPath?: string;
}

@Injectable()
export class ValidateAudioFilePipe implements PipeTransform {
  transform(file: Express.Multer.File): AudioFileExt {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi fornecido');
    }
    console.log(file);

    // Validar tipo MIME
    const allowedMimeTypes = ['audio/wav', 'audio/wave', 'audio/x-wav'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only WAV files are allowed.',
      );
    }

    // Guardar o caminho temporário no objeto file para posterior uso
    const tmpPath = path.join(os.tmpdir(), `audio_${Date.now()}.mp3`);
    fs.writeFileSync(tmpPath, file.buffer);

    const extendedFile = file as AudioFileExt;
    extendedFile.tmpPath = tmpPath;
    console.log(extendedFile);

    return extendedFile;
  }
}
