# 🔐 Guia de Segurança - Apoio Emocional Angola

## Resumo das Melhorias de Segurança Implementadas

Este projeto foi fortemente melhorado com várias camadas de segurança para proteger os usuários:

---

## 1. **Validação de Nomes** 🔤

### Regras:
- ✅ Mínimo 3, máximo 100 caracteres
- ✅ Apenas letras (incluindo acentuadas: João, José, etc.)
- ✅ Nome completo obrigatório (mínimo 2 palavras)
- ✅ Suporta hífens e apóstrofos (Maria-José, O'Connor)
- ❌ Rejeita números puros (123456)
- ❌ Rejeita caracteres especiais perigosos: `< > { } [ ] ; : " ' % $ # @ ! |`
- ❌ Rejeita padrões suspeitos: admin, root, test, fake, user, sistema

### Exemplos:
| Entrada | Status | Motivo |
|---------|--------|--------|
| "João Silva" | ✅ Aceito | Nome válido |
| "Maria-José Santos" | ✅ Aceito | Suporta hífens |
| "123456" | ❌ Rejeitado | Apenas números |
| "João" | ❌ Rejeitado | Falta sobrenome |
| "A B" | ❌ Rejeitado | Partes muito pequenas |

---

## 2. **Validação de Email** 📧

### Regras:
- ✅ Formato RFC 5322 (usuario@dominio.com)
- ✅ Domínios reais e válidos
- ✅ Suporta múltiplos tipos de TLD
- ❌ Rejeita domínios de teste (test.com, example.com, mock.com, etc.)
- ❌ Rejeita emails comuns de teste (admin@, test@, root@)
- ❌ Rejeita domínios muito curtos ou inválidos
- ❌ Rejeita caracteres perigosos: `< > ; : " ' % | \`

### Domínios Bloqueados:
```
test.com, test.org, test.net
example.com, example.org, example.net
placeholder.com, mock.com, fake.com, invalid.com
localhost, 127.0.0.1, 0.0.0.0
```

### Exemplos:
| Entrada | Status | Motivo |
|---------|--------|--------|
| "joao@gmail.com" | ✅ Aceito | Email válido |
| "user@example.com" | ❌ Rejeitado | Domínio de teste |
| "teste@test.com" | ❌ Rejeitado | Domínio de teste |
| "admin@company.com" | ❌ Rejeitado | Email suspeito de teste |

---

## 3. **Validação de Telefone** 📱

### Regras para Angola:
- ✅ 8-9 dígitos válidos
- ✅ Começa com 9 (celular) ou 2 (fixo)
- ✅ Suporta formato internacional: +244
- ❌ Rejeita sequências repetidas (0000000, 1111111)
- ❌ Rejeita padrões óbvios (123456789, 987654321)
- ❌ Rejeita números de teste comuns

### Operadoras Reconhecidas:
- **9xx** - Vodacom, Angola Telecom, Unitel (celular)
- **222-226** - Telefone fixo (Luanda)
- **231-236** - Telefone fixo (outras regiões)

### Exemplos:
| Entrada | Status | Motivo |
|---------|--------|--------|
| "+244 914 123 456" | ✅ Aceito | Celular válido |
| "222123456" | ✅ Aceito | Fixo Luanda válido |
| "000000000" | ❌ Rejeitado | Sequência repetida |
| "123456789" | ❌ Rejeitado | Padrão óbvio |

---

## 4. **Validação de Senha** 🔐

### Requisitos Obrigatórios:
- ✅ Mínimo **8 caracteres**, máximo 128
- ✅ Pelo menos 1 **letra maiúscula** (A-Z)
- ✅ Pelo menos 1 **letra minúscula** (a-z)
- ✅ Pelo menos 1 **número** (0-9)
- ✅ Caracteres especiais aumentam força: `!@#$%^&*`

### Indicador de Força em Tempo Real:
- 🔴 **Fraca** - Faltam requisitos básicos
- 🟡 **Média** - Tem maiúscula, minúscula e número
- 🟢 **Forte** - Tem tudo + caracteres especiais

### Padrões Fracos Rejeitados:
```
"123456", "password", "qwerty"
"abc123", "111111", "000000"
"password123", "admin123", "test123"
```

### Exemplos:
| Entrada | Força | Status |
|---------|-------|--------|
| "senha" | 🔴 Fraca | ❌ Rejeitado (menos de 8 caracteres) |
| "Senha123" | 🟡 Média | ✅ Aceito (requisitos básicos) |
| "Senha@123!" | 🟢 Forte | ✅ Aceito (completo) |

---

## 5. **Proteção contra Força Bruta** 🛡️

### Como Funciona:
- ⏱️ Máximo **5 tentativas** de login falhadas
- 🔒 Bloqueio automático por **30 minutos** após atingir o limite
- 👁️ Contador visível para o usuário
- 🔓 Desbloqueio automático após 30 minutos
- 🔄 Reset imediato após login bem-sucedido

### Interface de Feedback:
```
❌ Tentativa 1 falha: "Credenciais inválidas (4 tentativas restantes)"
❌ Tentativa 2 falha: "Credenciais inválidas (3 tentativas restantes)"
...
❌ Tentativa 5 falha: "Muitas tentativas falhadas. Acesso bloqueado por 30 minutos."
🔒 Bloqueio ativo: Botão desabilitado, aviso laranja exibido
🔓 Após 30 minutos: Acesso restaurado automaticamente
```

### Armazenamento:
- Dados de bloqueio armazenados no **localStorage** do navegador
- Sincronização automática entre abas do navegador
- Sem exposição de dados sensíveis

---

## 6. **Arquivo de Validação** (lib/validation.ts)

Contém 4 funções principais:

### `validateName(name: string)`
```typescript
const result = validateName("João Silva");
// { isValid: true }
```

### `validateEmail(email: string)`
```typescript
const result = validateEmail("joao@gmail.com");
// { isValid: true }
```

### `validatePhone(phone: string)`
```typescript
const result = validatePhone("+244 914 123 456");
// { isValid: true }
```

### `validatePassword(password: string)`
```typescript
const result = validatePassword("Senha@123");
// {
//   isValid: true,
//   strength: "strong",
//   requirements: {
//     minLength: true,
//     hasUppercase: true,
//     hasLowercase: true,
//     hasNumber: true,
//     hasSpecialChar: true
//   }
// }
```

---

## 7. **Hook de Proteção Contra Força Bruta** (hooks/useBruteForceProtection.ts)

### Uso:
```typescript
const bruteForce = useBruteForceProtection();

// Propriedades:
bruteForce.isLocked              // boolean
bruteForce.attempts              // number
bruteForce.remainingAttempts     // number

// Métodos:
bruteForce.recordFailedAttempt() // registra tentativa falha
bruteForce.resetAttempts()       // reseta após sucesso
bruteForce.getRemainingLockTime()// tempo em ms
bruteForce.getLockedMessage()    // mensagem para usuário
```

---

## 8. **Páginas Melhoradas** 📄

### `/app/cadastro/page.tsx` (Registro)
✅ Validação em tempo real de todos os campos
✅ Indicador visual de força de senha
✅ Mensagens de erro específicas e claras
✅ Suporte para email e telefone
✅ Design responsivo e acessível

### `/app/login/page.tsx` (Login)
✅ Proteção contra força bruta
✅ Contador de tentativas restantes
✅ Bloqueio visual quando limitado
✅ Tempo de desbloqueio em tempo real
✅ Mensagens de segurança claras

---

## 9. **Melhores Práticas Implementadas** 🏆

### Segurança:
- ✅ Validação no **lado do cliente** para UX rápido
- ✅ Validação deve ocorrer também no **servidor** (não implementada neste exemplo)
- ✅ Senhas com requisitos de complexidade
- ✅ Proteção contra força bruta
- ✅ Sanitização de entradas

### Acessibilidade:
- ✅ Labels associadas aos inputs
- ✅ Mensagens de erro visíveis
- ✅ Indicadores de força de senha
- ✅ Navegação com teclado

### UX:
- ✅ Feedback imediato (validação em tempo real)
- ✅ Mensagens claras e em português
- ✅ Ícones visuais para diferentes tipos de aviso
- ✅ Botões desabilitados quando apropriado
- ✅ Tempo de bloqueio contagem regressiva

---

## 10. **Recomendações Futuras** 🚀

### Segurança no Servidor:
1. **Implementar validação no backend** (express, fastapi, etc.)
2. **Hash de senhas** com bcrypt ou argon2
3. **HTTPS obrigatório** em produção
4. **CSRF protection** com tokens
5. **Rate limiting** no servidor (mais robusto que cliente)
6. **Logs de segurança** para auditoria
7. **2FA (Two-Factor Authentication)** opcional
8. **Verificação de email** antes de ativar conta

### Banco de Dados:
1. Usar banco de dados seguro (PostgreSQL, MongoDB)
2. Criptografar dados sensíveis
3. Row-level security (RLS) para isolamento de dados
4. Backups regulares criptografados

### Monitoramento:
1. Alertas para múltiplas tentativas de login falhadas
2. Detecção de padrões suspeitos
3. Logs de todas as ações do usuário
4. Dashboard de segurança para admins

---

## 11. **Como Testar** 🧪

### Teste de Nome:
```
❌ "123456" - Rejeitado (números)
❌ "João" - Rejeitado (falta sobrenome)
✅ "João Silva" - Aceito
```

### Teste de Email:
```
❌ "joao@test.com" - Rejeitado (domínio de teste)
❌ "admin@company.com" - Rejeitado (email suspeito)
✅ "joao@gmail.com" - Aceito
```

### Teste de Telefone:
```
❌ "123456789" - Rejeitado (padrão óbvio)
❌ "000000000" - Rejeitado (repetido)
✅ "+244 914 123 456" - Aceito
✅ "222123456" - Aceito
```

### Teste de Força Bruta:
```
1. Tente login com senha errada 5 vezes
2. Na 6ª tentativa, veja o bloqueio ativado
3. Aguarde a contagem regressiva de 30 minutos
4. Ou feche o localStorage em DevTools para resetar
```

---

## 12. **Suporte e Contato** 💬

Para dúvidas sobre segurança:
- 📧 Email: suporte@apoioemocionalangola.ao
- 🌐 Website: www.apoioemocionalangola.ao
- ☎️ Telefone: +244 XXXX XXXX

---

**Última atualização:** 20 de Julho de 2026
**Versão:** 2.0 - Segurança Melhorada
**Status:** ✅ Todas as validações implementadas e testadas
