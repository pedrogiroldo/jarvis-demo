import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ActionResultDto } from './dto/action-result.dto';
import { ChefService } from 'src/chef/chef.service';
import { DriverService } from 'src/driver/driver.service';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly chefService: ChefService,
    private readonly driverService: DriverService,
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY must be set in environment variables');
    }

    this.openai = new OpenAI({
      apiKey,
      baseURL,
    });

    this.logger.log('OpenAI client initialized successfully');
  }

  async executeAction(instruction: string): Promise<ActionResultDto> {
    this.logger.log(`Recebida instrução: "${instruction}"`);

    try {
      // Classificar a instrução usando IA
      const actions = await this.classifyInstruction(instruction);

      // Executar as ações apropriadas
      const executedActions: Array<'chef' | 'driver'> = [];
      const messages: string[] = [];

      if (actions.includes('chef')) {
        await this.chefService.incrementChefCount();
        executedActions.push('chef');
        messages.push('Cozinheiro chamado');
        this.logger.log('Contador de cozinheiros incrementado');
      }

      if (actions.includes('driver')) {
        await this.driverService.incrementDriverCount();
        executedActions.push('driver');
        messages.push('Motorista chamado');
        this.logger.log('Contador de motoristas incrementado');
      }

      const message =
        executedActions.length > 0
          ? messages.join(' e ') + ' com sucesso'
          : 'Não foi possível identificar a ação solicitada';

      if (executedActions.length === 0) {
        this.logger.warn('Instrução não reconhecida pela IA');
      }

      const result: ActionResultDto = {
        actions: executedActions,
        message,
      };

      this.logger.log(`Resultado: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(`Erro ao executar ação: ${errorMessage}`);
      throw error;
    }
  }

  private async classifyInstruction(
    instruction: string,
  ): Promise<Array<'chef' | 'driver'>> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 segundo

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(
          `Tentativa ${attempt}/${maxRetries} de classificar instrução`,
        );

        const completion = await this.openai.chat.completions.create({
          model: 'nvidia/nemotron-nano-12b-v2-vl:free',
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: `Você é um assistente que interpreta comandos em português brasileiro.
Identifique se o usuário quer chamar um "cozinheiro" (chef) e/ou "motorista" (driver).
O usuário pode pedir um, outro, ou AMBOS ao mesmo tempo.

Responda APENAS com uma lista separada por vírgulas usando estas palavras: "chef", "driver".
Exemplos:
- "Preciso de um cozinheiro" -> "chef"
- "Chame um motorista" -> "driver"
- "Preciso de um cozinheiro e um motorista" -> "chef,driver"
- "Chame um chef e também um driver" -> "chef,driver"

Não adicione pontuação extra ou explicações. Se não identificar nenhum, responda apenas "unknown".`,
            },
            {
              role: 'user',
              content: instruction,
            },
          ],
        });

        const response = completion.choices[0]?.message?.content
          ?.trim()
          .toLowerCase();

        if (!response || response === 'unknown') {
          this.logger.warn(`Resposta inesperada da IA: ${response}`);
          return [];
        }

        // Parse da resposta para extrair as ações
        const actions: Array<'chef' | 'driver'> = [];
        if (response.includes('chef')) {
          actions.push('chef');
        }
        if (response.includes('driver')) {
          actions.push('driver');
        }

        this.logger.log(`Classificação bem-sucedida: ${actions.join(', ')}`);
        return actions;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido';
        this.logger.error(
          `Erro na tentativa ${attempt}/${maxRetries}: ${errorMessage}`,
        );

        if (attempt === maxRetries) {
          throw new Error(
            `Falha ao classificar instrução após ${maxRetries} tentativas: ${errorMessage}`,
          );
        }

        // Aguardar antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    return [];
  }
}
