import { Injectable } from '@nestjs/common';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import * as fs from 'fs';
import { TranscribeResponseDto } from './dto/transcribe-response.dto';

@Injectable()
export class AudioService {
  private speechConfig: sdk.SpeechConfig;

  constructor() {
    const subscriptionKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;

    if (!subscriptionKey || !region) {
      throw new Error(
        'AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set in environment variables',
      );
    }

    this.speechConfig = sdk.SpeechConfig.fromSubscription(
      subscriptionKey,
      region,
    );
    this.speechConfig.speechRecognitionLanguage = 'pt-BR';
  }

  async transcribeAudio(filePath: string): Promise<TranscribeResponseDto> {
    return new Promise((resolve, reject) => {
      // Usar fromWavFileInput para arquivos WAV
      const audioBuffer = fs.readFileSync(filePath);
      const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);

      const recognizer = new sdk.SpeechRecognizer(
        this.speechConfig,
        audioConfig,
      );

      // Usar recognizeOnceAsync para reconhecimento simples
      recognizer.recognizeOnceAsync(
        (result) => {
          console.log(`Recognition result reason: ${result.reason}`);

          switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
              console.log(`RECOGNIZED: Text=${result.text}`);
              recognizer.close();
              resolve({
                text: result.text,
              });
              break;
            case sdk.ResultReason.NoMatch:
              console.log('NOMATCH: Speech could not be recognized.');
              recognizer.close();
              resolve({
                text: '',
              });
              break;
            case sdk.ResultReason.Canceled: {
              const cancellation = sdk.CancellationDetails.fromResult(result);
              console.error(
                `CANCELED: Reason=${cancellation.reason}, ErrorDetails=${cancellation.errorDetails}`,
              );
              recognizer.close();
              reject(
                new Error(
                  `Speech recognition canceled: ${cancellation.errorDetails || cancellation.reason}`,
                ),
              );
              break;
            }
            default:
              recognizer.close();
              reject(new Error(`Unexpected result reason: ${result.reason}`));
          }
        },
        (error) => {
          console.error(`Recognition error: ${error}`);
          recognizer.close();
          reject(new Error(`Failed to recognize speech: ${error}`));
        },
      );
    });
  }
}
