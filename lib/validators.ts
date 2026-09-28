/**
 * Validadores de segurança para registro e login
 */

// Validação de nomes - apenas letras, espaços e hífens
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: "Nome é obrigatório" }
  }

  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: "Nome não pode estar vazio" }
  }

  // PRIMEIRA VALIDAÇÃO: Rejeita QUALQUER dígito (0-9)
  if (/[0-9]/.test(trimmed)) {
    return { valid: false, error: "Nome não pode conter números" }
  }

  if (trimmed.length < 5) {
    return { valid: false, error: "Nome deve ter pelo menos 5 caracteres" }
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Nome não pode exceder 100 caracteres" }
  }

  // Verifica se contém apenas letras (incluindo acentuadas), espaços e hífens
  // Rejeita qualquer outro caractere
  if (!/^[a-záàâãéèêíïóôõöúçñ\s\-]+$/i.test(trimmed)) {
    return { valid: false, error: "Nome deve conter apenas letras, espaços e hífens" }
  }

  // Rejeita espaços múltiplos
  if (/\s{2,}/.test(trimmed)) {
    return { valid: false, error: "Não use espaços múltiplos no nome" }
  }

  // Rejeita hífens múltiplos
  if (/\-{2,}/.test(trimmed)) {
    return { valid: false, error: "Não use hífens múltiplos no nome" }
  }

  // Rejeita se começa ou termina com hífen ou espaço
  if (/^[\s\-]|[\s\-]$/.test(trimmed)) {
    return { valid: false, error: "Nome não pode começar ou terminar com espaço ou hífen" }
  }

  // Deve ter pelo menos 2 palavras separadas por espaço
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0)
  if (words.length < 2) {
    return { valid: false, error: "Digite seu nome completo (nome e sobrenome)" }
  }

  // Cada palavra deve ter no mínimo 2 letras
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word.length < 2) {
      return { valid: false, error: `Palavra ${i + 1} do nome deve ter no mínimo 2 letras` }
    }
    // Rejeita palavras que são números disfarçados
    if (/[0-9]/.test(word)) {
      return { valid: false, error: "Nome contém números" }
    }
  }

  // Rejeita SQL injection patterns
  const sqlPatterns = ["';", "--", "/*", "*/", "xp_", "sp_", "exec", "execute", "select", "insert", "update", "delete", "drop", "union", "create", "alter"]
  const lowerName = trimmed.toLowerCase()
  for (const pattern of sqlPatterns) {
    if (lowerName.includes(pattern)) {
      return { valid: false, error: "Nome contém caracteres não permitidos" }
    }
  }

  // Rejeita nomes de teste/fake
  const invalidNames = ["admin", "root", "test", "fake", "null", "undefined", "anonymous", "system", "administrator"]
  if (invalidNames.some((invalid) => lowerName === invalid || lowerName.includes(invalid))) {
    return { valid: false, error: "Use seu nome real" }
  }

  return { valid: true }
}

// Validação de email
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase()

  if (!trimmed) {
    return { valid: false, error: "Email é obrigatório" }
  }

  if (trimmed.length < 5) {
    return { valid: false, error: "Email deve ter no mínimo 5 caracteres" }
  }

  if (trimmed.length > 254) {
    return { valid: false, error: "Email muito longo" }
  }

  // Regex RFC 5322 simplificado para validação básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Email inválido. Use o formato: seu@email.com" }
  }

  // Validações adicionais
  if (trimmed.includes("..")) {
    return { valid: false, error: "Email inválido" }
  }

  if (trimmed.startsWith(".") || trimmed.endsWith(".")) {
    return { valid: false, error: "Email inválido" }
  }

  // Rejeita caracteres perigosos
  if (/[<>()[\]{}\\;:'"`,]/.test(trimmed)) {
    return { valid: false, error: "Email contém caracteres não permitidos" }
  }

  // Verifica domínios fake/teste (lista expandida)
  const bannedDomains = [
    "test.com",
    "test.org",
    "test.net",
    "example.com",
    "example.org",
    "example.net",
    "placeholder.com",
    "mock.com",
    "fake.com",
    "invalid.com",
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "admin@test",
    "test@test",
  ]
  if (bannedDomains.some((domain) => trimmed.includes(domain))) {
    return { valid: false, error: "Use um email real (não use domínios de teste)" }
  }

  // Verifica domínios muito curtos ou suspeitos
  const [localPart, domain] = trimmed.split("@")
  if (!domain || domain.length < 5) {
    return { valid: false, error: "Domínio de email inválido" }
  }

  // Valida que o domínio tem extensão conhecida (não aceita .x ou .12)
  const domainParts = domain.split(".")
  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2 || /^\d+$/.test(tld)) {
    return { valid: false, error: "Extensão de domínio inválida" }
  }

  // Rejeita emails muito comuns de teste
  if (localPart === "admin" || localPart === "test" || localPart === "root" || localPart === "user") {
    return { valid: false, error: "Use um email pessoal válido" }
  }

  return { valid: true }
}

// Validação de telefone (formato angolano)
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  const trimmed = phone.trim()

  if (!trimmed) {
    return { valid: false, error: "Telefone é obrigatório" }
  }

  // Remove símbolos comuns
  let cleaned = trimmed.replace(/[\-\(\)\+\s]/g, "")

  // Se começa com +244, remove o prefixo internacional
  if (cleaned.startsWith("244")) {
    cleaned = cleaned.substring(3)
  }

  // Verifica se são apenas dígitos
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: "Telefone deve conter apenas números" }
  }

  // Valida comprimento (Angola: 8 ou 9 dígitos)
  if (cleaned.length < 8 || cleaned.length > 9) {
    return { valid: false, error: "Telefone deve ter 8 ou 9 dígitos" }
  }

  // Verifica se começa com números válidos angolanos
  // Angola: 9xx (celular), 222-226 (Luanda), 231-236 (outras cidades)
  const validStarts = ["9", "222", "223", "224", "225", "226", "231", "232", "233", "234", "235", "236", "2"]
  let isValid = false
  for (const start of validStarts) {
    if (cleaned.startsWith(start)) {
      isValid = true
      break
    }
  }
  if (!isValid) {
    return { valid: false, error: "Número de telefone inválido para Angola" }
  }

  // Rejeita telefones com muitos números repetidos (000000000, 1111111111)
  if (/^(\d)\1{6,}$/.test(cleaned)) {
    return { valid: false, error: "Telefone inválido" }
  }

  // Rejeita sequências simples (123456789, 987654321)
  if (/^(0123456789|9876543210|12345678|87654321|111111|222222|333333|444444|555555|666666|777777|888888|999999)$/.test(cleaned)) {
    return { valid: false, error: "Telefone inválido" }
  }

  // Rejeita padrões de teste comuns
  if (/^(0000|1111|2222|9999)/.test(cleaned)) {
    return { valid: false, error: "Telefone inválido" }
  }

  return { valid: true }
}

// Validação de senha (força)
export function validatePassword(password: string): { valid: boolean; error?: string; strength: "fraca" | "media" | "forte" } {
  let strength: "fraca" | "media" | "forte" = "fraca"

  if (!password) {
    return { valid: false, error: "Senha é obrigatória", strength: "fraca" }
  }

  if (password.length < 8) {
    return { valid: false, error: "Senha deve ter no mínimo 8 caracteres", strength: "fraca" }
  }

  if (password.length > 128) {
    return { valid: false, error: "Senha muito longa", strength: "fraca" }
  }

  // Verificações de complexidade
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  const complexityScore = Number(hasLowerCase) + Number(hasUpperCase) + Number(hasNumbers) + Number(hasSpecialChars)

  // Exige pelo menos 3 tipos de caracteres (maiúscula, minúscula, número)
  if (!hasLowerCase || !hasUpperCase || !hasNumbers) {
    const missing = []
    if (!hasUpperCase) missing.push("letra maiúscula")
    if (!hasLowerCase) missing.push("letra minúscula")
    if (!hasNumbers) missing.push("número")
    return {
      valid: false,
      error: `Adicione: ${missing.join(", ")}`,
      strength: "fraca",
    }
  }

  if (complexityScore === 3) {
    strength = "media"
  } else if (complexityScore === 4) {
    strength = "forte"
  }

  // Rejeita padrões comuns fracos
  const weakPatterns = [
    "123456",
    "654321",
    "password",
    "qwerty",
    "abc123",
    "111111",
    "000000",
    "aaaaaa",
    "bbbbbb",
    "123123",
    "password123",
    "admin123",
    "user123",
    "test123",
  ]
  if (weakPatterns.some((pattern) => password.toLowerCase().includes(pattern))) {
    return {
      valid: false,
      error: "Senha muito fraca. Evite padrões comuns",
      strength: "fraca",
    }
  }

  // Rejeita sequências óbvias
  if (/^[a-z]+[0-9]+$/i.test(password) && password.length < 10) {
    return {
      valid: false,
      error: "Adicione caracteres especiais (!@#$%) ou use uma senha mais complexa",
      strength: "media",
    }
  }

  return { valid: true, strength }
}

// Validação de contacto (email ou telefone)
export function validateContact(
  contact: string,
  type: "email" | "telefone",
): { valid: boolean; error?: string } {
  if (type === "email") {
    return validateEmail(contact)
  } else {
    return validatePhone(contact)
  }
}

// Sanitização de entrada
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

// Validação completa de registro
export function validateRegistration(data: {
  nome: string
  contacto: string
  contactoTipo: "email" | "telefone"
  senha: string
  confirmarSenha: string
}): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Validar nome
  const nameValidation = validateName(data.nome)
  if (!nameValidation.valid) {
    errors.nome = nameValidation.error || "Nome inválido"
  }

  // Validar contacto
  const contactValidation = validateContact(data.contacto, data.contactoTipo)
  if (!contactValidation.valid) {
    errors.contacto = contactValidation.error || "Contacto inválido"
  }

  // Validar senha
  const passwordValidation = validatePassword(data.senha)
  if (!passwordValidation.valid) {
    errors.senha = passwordValidation.error || "Senha inválida"
  }

  // Verificar se as senhas coincidem
  if (data.senha !== data.confirmarSenha) {
    errors.confirmarSenha = "As senhas não coincidem"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
