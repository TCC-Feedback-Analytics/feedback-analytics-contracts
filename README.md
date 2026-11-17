# feedback-analytics-contracts (`@feedback/lib-shared`)

Pacote de **contratos compartilhados** do [Feedback Analytics](https://github.com/TCC-Feedback-Analytics/feedback-analytics): os **tipos TypeScript** (entidades, contratos de request/response, tipos de domínio) e os **schemas de validação Zod** usados de forma consistente pelos serviços — [web](https://github.com/TCC-Feedback-Analytics/feedback-analytics-web), [api-gateway](https://github.com/TCC-Feedback-Analytics/feedback-analytics-api-gateway) e [ia-analyze](https://github.com/TCC-Feedback-Analytics/feedback-analytics-ia-analyze).

É a **fonte única de verdade** dos contratos: um formato de payload muda aqui e o TypeScript acusa quebras em quem consome.

## Estrutura

- **`interfaces/`** — tipos (só compilação):
  - `entities/` — entidades do sistema (`auth-user`, `enterprise`, `enterprise-and-user`)
  - `contracts/` — payloads/responses de integração (`enterprise`, `action-data`, `ia-analyze/*`, `qrcode/*`)
  - `domain/` — tipos de domínio compartilhados (`feedback.domain`)
- **`schemas/`** — schemas de validação **Zod** (runtime):
  - `public/` — `login`, `register`, `forgotPassword`, `feedback`, `feedbackChannel` (canal de coleta), `commentField` (campo de comentário por escopo) e `passwordPolicy` (tamanho mínimo e mensagens da senha)
  - `user/` — `emailUpdate`, `enterpriseUpdate`, `metadadosUpdate`, `name`, `phone`, `resetPassword`

> **Autenticação:** o provedor de auth do sistema é o **Better Auth** (a sessão é gerenciada pelo api-gateway via cookie httpOnly). Isso é detalhe do gateway — os **contratos aqui não mudam**: os schemas de auth (`login`, `register`, `forgotPassword`, `resetPassword`, etc.) continuam com o **mesmo shape**.

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
"@feedback/lib-shared": "github:TCC-Feedback-Analytics/feedback-analytics-contracts#v1.9.0"
```

Em 16/11/2026, cada serviço fixa uma tag, igual na `developer` e na `main`:

| Serviço | Tag |
|---|---|
| Web | `v1.9.0` |
| API Gateway | `v1.8.0` |
| IA Analyze | `v1.7.0` |

As tags diferentes não quebram a integração: entre a `v1.7.0` e a `v1.9.0`, os contratos de `ia-analyze` que o Gateway e o IA Analyze trocam são os mesmos.

Os imports usam o `exports` map do `package.json` (`./interfaces/*` e `./schemas/*`):

```ts
import type { Enterprise } from '@feedback/lib-shared/interfaces/entities/enterprise.entity';
import { loginSchema } from '@feedback/lib-shared/schemas/public/loginSchema';
```

> **`zod` é `peerDependency`** (`^4`): quem consome os `schemas/` precisa ter o `zod` instalado (os serviços já têm).

## Versionamento

Mudou um contrato? Bumpe a `version` no `package.json`, crie a **tag** git correspondente e atualize a dependência nos consumidores. Como cada serviço **fixa a tag**, um contrato novo só chega quando o serviço sobe a versão — e o TypeScript pega as quebras na atualização.

O pacote não tem testes próprios (o `npm test` passa sem nenhum teste) nem CI. Quem confere os contratos é o typecheck e os testes de cada serviço que os consome.

| Tag | Data | O que entrou |
|---|---|---|
| `v1.0.0` | 02/07/2026 | O pacote separado do monorepo, com build `tsc`, `exports` e `zod` como `peerDependency` |
| `v1.1.0` | 09/10/2026 | Sugestões das perguntas da empresa pela IA |
| `v1.2.0` | 19/10/2026 | Diagnóstico do escopo |
| `v1.3.0` | 21/10/2026 | Cadastro sem CPF e CNPJ |
| `v1.4.0` | 21/10/2026 | Comentário opcional no formulário |
| `v1.5.0` | 21/10/2026 | Campo de comentário por escopo (`comment_field`) |
| `v1.6.0` | 22/10/2026 | Pergunta do comentário enviada à análise (`comment_prompt`) |
| `v1.7.0` | 31/10/2026 | Canal de coleta: QR Code, link ou NFC (`channels`) |
| `v1.8.0` | 31/10/2026 | Canal na lista de feedbacks |
| `v1.9.0` | 05/11/2026 | Lista de feedbacks sem IP, navegador e fingerprint do aparelho (LGPD) |
| `v1.10.0` | 16/11/2026 | Síntese de insights do IA Analyze (`insights-synthesis`), antes copiada no Gateway e no IA Analyze |

> Contexto da separação (monorepo → multi-repo) e demais decisões vivem no [repositório central de documentação](https://github.com/TCC-Feedback-Analytics/feedback-analytics).
