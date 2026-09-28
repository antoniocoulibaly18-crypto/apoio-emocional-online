# Como ativar o chat com psicólogos reais

O que mudou: o "Chat com Psicólogo" deixou de ser uma IA fingindo ser humana e agora
é um chat em tempo real de verdade, ligando o usuário a um psicólogo que faz login
na plataforma. O "Assistente Empático" continua sendo IA (e já era rotulado como tal).

## 1. Criar o projeto no Supabase

1. Crie uma conta gratuita em https://supabase.com
2. Crie um novo projeto
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`
4. Copie o ficheiro `.env.example` para `.env.local` e cole esses dois valores

## 2. Criar as tabelas

1. No painel do Supabase, abra **SQL Editor → New query**
2. Cole todo o conteúdo do ficheiro `supabase/schema.sql` deste projeto e execute
3. Isso cria as tabelas `psicologos`, `conversas`, `mensagens`, já com Realtime ligado
4. Depois, cole e execute também `supabase/migration_emergencia.sql` — isso adiciona
   as colunas `prioridade` e `origem` usadas pelo alerta de emergência da IA (passo 7)

## 3. Instalar as novas dependências

```bash
pnpm install
```

(adicionamos `@supabase/supabase-js` e `@supabase/ssr` ao `package.json`)

## 4. Como um psicólogo entra na plataforma

- O psicólogo acessa `/psicologo/login` e clica em "Cadastrar-se"
- Preenche nome, número de registo profissional (CRP) e email/senha
- A conta fica **inativa por padrão** — ele não consegue atender ninguém ainda

## 5. Aprovar um psicólogo (você, como administrador)

Ainda não existe um painel de administração — por enquanto, aprovar é manual:

1. No Supabase, vá em **Table Editor → psicologos**
2. Encontre o registo da pessoa e mude a coluna `ativo` para `true`

Depois disso, ele consegue entrar em `/psicologo/dashboard`, ver a fila de conversas
e responder aos usuários em tempo real.

## 6. Como funciona para o usuário

Quando o usuário abre o "Chat com Psicólogo" em `/servicos`, uma conversa é criada
com status `aguardando`. Assim que um psicólogo aprovado "assume" essa conversa no
dashboard dele, o nome e CRP reais aparecem no chat do usuário e as mensagens
passam a ir e voltar em tempo real (via Supabase Realtime).

## 7. Alerta de emergência pelo Assistente de IA

O "Assistente Empático" (IA) agora consegue chamar um psicólogo humano de verdade quando
detecta sinais de risco na conversa (menção a se magoar, tirar a própria vida, ou perigo
imediato). Quando isso acontece:

- Uma conversa é criada automaticamente com prioridade `urgente` e origem `assistente_ia`
- Ela aparece destacada em vermelho, no topo da fila, no `/psicologo/dashboard`
- A IA avisa a pessoa, na própria conversa, que um psicólogo humano foi notificado
- O psicólogo assume essa conversa normalmente pelo dashboard, como qualquer outra

Isto depende da tabela `conversas` ter as colunas `prioridade` e `origem` — rode
`supabase/migration_emergencia.sql` se ainda não rodou.

**Importante**: isto não substitui uma linha de crise real. A IA pode falhar em detectar
um risco, ou o psicólogo pode demorar a ver a fila. Vale manter, em paralelo, contactos de
emergência reais e visíveis no site para situações que não podem esperar.

## Limitação de segurança a saber

O login do **usuário** (em `lib/auth.ts`) ainda usa `localStorage`, sem autenticação
real no servidor. Por isso, as regras de acesso (RLS) das tabelas `conversas` e
`mensagens` estão mais abertas do que o ideal — qualquer requisição autenticada no
Supabase consegue ler mensagens de qualquer conversa, contanto que saiba o ID dela.
Isso não é ideal para dados sensíveis de saúde mental. Se quiser reforçar isso,
o próximo passo seria migrar o login do usuário também para o Supabase Auth, para
que a RLS possa checar `usuario_id = auth.uid()` de verdade. Posso ajudar com isso
quando quiser.
