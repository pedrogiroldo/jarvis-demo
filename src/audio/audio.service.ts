import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import { TranscribeResponseDto } from './dto/transcribe-response.dto';

@Injectable()
export class AudioService {
  private openaiClient: OpenAI;

  constructor() {
    this.openaiClient = new OpenAI();
  }

  async transcribeAudio(filePath: string): Promise<TranscribeResponseDto> {
    const audioBuffer = fs.readFileSync(filePath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const audioFile = new (File as any)([audioBuffer], 'audio.mp3', {
      type: 'audio/mpeg',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const transcript = await this.openaiClient.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pt',
    });

    return {
      text: transcript.text,
    };
  }
}
