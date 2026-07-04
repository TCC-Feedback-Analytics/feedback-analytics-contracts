# feedback-analytics-contracts (`@feedback/lib-shared`)

Pacote de **contratos compartilhados** do [Feedback Analytics](https://github.com/TCC-Feedback-Analytics/feedback-analytics): os **tipos TypeScript** (entidades, contratos de request/response, tipos de domínio) e os **schemas de validação Zod** usados de forma consistente pelos serviços — [web](https://github.com/TCC-Feedback-Analytics/feedback-analytics-web), [api-gateway](https://github.com/TCC-Feedback-Analytics/feedback-analytics-api-gateway) e [ia-analyze](https://github.com/TCC-Feedback-Analytics/feedback-analytics-ia-analyze).

É a **fonte única de verdade** dos contratos: um formato de payload muda aqui e o TypeScript acusa quebras em quem consome.

## Estrutura

- **`interfaces/`** — tipos (só compilação):
  - `entities/` — entidades do sistema (`auth-user`, `enterprise`, `enterprise-and-user`)
  - `contracts/` — payloads/responses de integração (`enterprise`, `action-data`, `ia-analyze/*`, `qrcode/*`)
  - `domain/` — tipos de domínio compartilhados (`feedback.domain`)
- **`schemas/`** — schemas de validação **Zod** (runtime):
  - `public/` — `login`, `register`, `forgotPassword`, `feedback`
  - `user/` — `emailUpdate`, `enterpriseUpdate`, `metadadosUpdate`, `name`, `phone`, `resetPassword`

Convenção de nomes e regras de uso: [`interfaces/README.md`](interfaces/README.md).

## Build

O pacote é **compilado** para `dist/` (JS + `.d.ts`):

```bash
npm install
npm run build   # tsc -p tsconfig.build.json → dist/
```

O script `prepare` roda o build automaticamente na instalação — então consumidores que instalam direto do Git recebem o `dist/` pronto.

## Como é consumido

Distribuído **por tag git** (não no registry do npm — `private: true`). Cada serviço declara a dependência apontando para uma tag:

```json
"@feedback/lib-shared": "github:TCC-Feedback-Analytics/feedback-analytics-contracts#v1.0.0"
```

Os imports usam o `exports` map do `package.json` (`./interfaces/*` e `./schemas/*`):

```ts
import type { Enterprise } from '@feedback/lib-shared/interfaces/entities/enterprise.entity';
import { loginSchema } from '@feedback/lib-shared/schemas/public/loginSchema';
```

> **`zod` é `peerDependency`** (`^4`): quem consome os `schemas/` precisa ter o `zod` instalado (os serviços já têm).

## Versionamento

Mudou um contrato? Bumpe a `version` no `package.json`, crie a **tag** git correspondente e atualize a dependência nos consumidores. Como cada serviço **fixa a tag**, um contrato novo só chega quando o serviço sobe a versão — e o TypeScript pega as quebras na atualização.

> Contexto da separação (monorepo → multi-repo) e demais decisões vivem no [repositório central de documentação](https://github.com/TCC-Feedback-Analytics/feedback-analytics).
