# Padrão de Interfaces

Parte do pacote [`@feedback/lib-shared`](../README.md). Este diretório (`interfaces/`) contém apenas **contratos de tipagem** (só compilação); os **schemas de validação Zod** (runtime) ficam em `schemas/`.

## Estrutura

- `entities/`
  - Entidades centrais do sistema (usuário autenticado, empresa, composições entre entidades).
  - Ex.: `auth-user.entity.ts`, `enterprise.entity.ts`, `enterprise-and-user.entity.ts`

- `contracts/`
  - Contratos de entrada/saída reutilizáveis entre frontend e backend (payloads e responses).
  - Ex.: `qrcode/question.contract.ts`, `ia-analyze/run.contract.ts`, `enterprise.contract.ts`, `action-data.contract.ts`

- `domain/`
  - Tipos de domínio reutilizáveis entre services, loaders, pages e components.
  - Ex.: `feedback.domain.ts`

## Convenção de nomes

- `*.entity.ts`: entidade do núcleo do sistema.
- `*.contract.ts`: contrato de request/response de integração.
- `*.domain.ts`: tipos de domínio compartilhados.

## Regra de uso

- Tipos de apresentação (props de componente/página) **não** ficam aqui.
- Tipos de apresentação devem ficar próximos do uso — em arquivos `ui.types.ts` nos repositórios que consomem (ex.: `components/`/`pages/` do web), **não** neste pacote.
