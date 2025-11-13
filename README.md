# Jarvis Demo

https://jarvis-demo-liart.vercel.app/

## Sobre o Projeto

Este projeto é uma **prova de conceito** que demonstra o uso de inteligência artificial para executar comandos em uma aplicação através da interpretação de mensagens de voz.

Construído com **NestJS**, o projeto integra diversas tecnologias para criar um assistente de voz capaz de processar comandos e executar ações no banco de dados.

## Como Funciona

O fluxo de execução do projeto segue estas etapas:

1. **Frontend**: O NestJS serve um frontend que captura áudio do usuário através do microfone, converte o áudio para formato WAV e envia para uma rota do backend.

2. **Transcrição**: O backend recebe o áudio e utiliza o **Azure Speech Service** para transcrever o áudio em texto.

3. **Interpretação por LLM**: Um Large Language Model (LLM) é instruído a interpretar o texto transcrito e identificar qual ferramenta deve ser executada com base no comando do usuário.

4. **Execução**: A ferramenta identificada é executada, atualizando os dados no banco de dados conforme solicitado.

## Tecnologias Utilizadas

- **NestJS** - Framework Node.js para construção da aplicação
- **Azure Speech Service** - Serviço de transcrição de áudio para texto
- **LLM** - Modelo de linguagem para interpretação de comandos
- **Prisma** - ORM para gerenciamento do banco de dados

## Estrutura do Projeto

```
src/
├── agent/         # Módulo de agentes e ferramentas LLM
├── audio/         # Módulo de processamento de áudio
├── frontend/      # Módulo que serve a interface do usuário
├── prisma/        # Configuração do Prisma ORM
└── main.ts        # Ponto de entrada da aplicação
```
