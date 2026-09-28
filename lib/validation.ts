/**
 * Validação de Nomes
 * - Mínimo 3, máximo 100 caracteres
 * - Apenas letras, espaços, hífens e apóstrofos
 * - Rejeita números, caracteres especiais perigosos
 * - Exige nome completo (pelo menos 2 palavras)
 * - Suporta caracteres acentuados
 */
export function validateName(name: string): {
  isValid: boolean
  error?: string
} {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Nome é obrigatório" }
  }

  const trimmed = name.trim()

  // Verificar comprimento
  if (trimmed.length < 3) {
    return { isValid: false, error: "Nome deve ter pelo menos 3 caracteres" }
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: "Nome não pode exceder 100 caracteres" }
  }

  // Rejeita apenas números
  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: "Nome não pode conter apenas números" }
  }

  // Rejeita caracteres perigosos
  if (/<|>|{|}|\[|\]|;|:|"|'|`|%|\$|#|@|!|\||\\|\/|\?|\*|~|=|\^/g.test(trimmed)) {
    return { isValid: false, error: "Nome contém caracteres não permitidos" }
  }

  // Permite apenas letras (incluindo acentuadas), espaços, hífens e apóstrofos
  if (!/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s\-']+$/.test(trimmed)) {
    return { isValid: false, error: "Nome contém caracteres inválidos" }
  }

  // Verificar nome completo (pelo menos 2 palavras)
  const parts = trimmed.split(/\s+/).filter((p) => p.length > 0)

  if (parts.length < 2) {
    return { isValid: false, error: "Por favor, digite seu nome completo (ex: João Silva)" }
  }

  // Rejeita padrões suspeitos
  const suspiciousPatterns = [
    /^admin/i,
    /^root/i,
    /^test/i,
    /^fake/i,
    /^user/i,
    /^sistema/i,
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: "Este nome não é válido" }
    }
  }

  // Rejeita partes do nome muito pequenas
  for (const part of parts) {
    if (part.length === 1 && !/^[aeoui-]/i.test(part)) {
      return { isValid: false, error: "Cada parte do nome deve ter pelo menos 2 caracteres" }
    }
  }

  return { isValid: true }
}

/**
 * Validação de Email
 * - Formato RFC 5322
 * - Rejeita domínios de teste
 * - Rejeita emails comuns de teste
 * - Valida extensão de domínio
 */
export function validateEmail(email: string): {
  isValid: boolean
  error?: string
} {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email é obrigatório" }
  }

  const trimmed = email.trim().toLowerCase()

  // Verificar caracteres perigosos
  if (/<|>|;|:|"|'|`|%|\||\\|^|{|}|\[|]/.test(trimmed)) {
    return { isValid: false, error: "Email contém caracteres inválidos" }
  }

  // Validação básica RFC 5322
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Email inválido" }
  }

  const [localPart, domain] = trimmed.split("@")

  // Rejeitar emails comuns de teste
  const testEmails = [
    "admin@",
    "test@",
    "root@",
    "user@",
    "noreply@",
    "sistema@",
  ]

  for (const test of testEmails) {
    if (localPart.startsWith(test.replace("@", ""))) {
      return { isValid: false, error: "Este email não é válido" }
    }
  }

  // Rejeitar domínios de teste e inválidos
  const blockedDomains = [
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
    "your-domain.com",
    "domain.com",
  ]

  if (blockedDomains.includes(domain)) {
    return { isValid: false, error: "Este domínio de email não é válido" }
  }

  // Rejeitar domínios muito curtos
  if (domain.length < 5) {
    return { isValid: false, error: "Email inválido" }
  }

  // Validar extensão de domínio
  const domainParts = domain.split(".")
  const tld = domainParts[domainParts.length - 1]

  if (tld.length < 2 || /^\d+$/.test(tld)) {
    return { isValid: false, error: "Email inválido" }
  }

  return { isValid: true }
}

/**
 * Validação de Telefone
 * - Suporta formato angolano (+244)
 * - 8-9 dígitos
 * - Rejeita sequências repetidas e padrões óbvios
 */
export function validatePhone(phone: string): {
  isValid: boolean
  error?: string
} {
  if (!phone || typeof phone !== "string") {
    return { isValid: false, error: "Telefone é obrigatório" }
  }

  let cleaned = phone
    .trim()
    .replace(/\s+/g, "")
    .replace(/\D/g, "")

  // Aceitar formato internacional
  if (cleaned.startsWith("244")) {
    cleaned = cleaned.slice(3)
  }

  // Verificar comprimento
  if (cleaned.length < 8 || cleaned.length > 9) {
    return { isValid: false, error: "Telefone deve ter 8-9 dígitos" }
  }

  // Rejeitar sequências repetidas
  if (/^(\d)\1{7,}$/.test(cleaned)) {
    return { isValid: false, error: "Telefone inválido" }
  }

  // Rejeitar padrões óbvios
  if (
    /^(123456|234567|345678|456789|567890|987654|876543|765432|654321|543210)/.test(
      cleaned,
    )
  ) {
    return { isValid: false, error: "Telefone inválido" }
  }

  // Validar primeiro dígito (9xx para celular, 2xx para fixo)
  const firstDigit = cleaned[0]
  if (firstDigit !== "2" && firstDigit !== "9") {
    return { isValid: false, error: "Telefone inválido para Angola" }
  }

  return { isValid: true }
}

/**
 * Validação de Senha
 * - Mínimo 8 caracteres
 * - Máximo 128 caracteres
 * - Deve conter: maiúscula, minúscula, número
 */
export function validatePassword(password: string): {
  isValid: boolean
  strength: "weak" | "medium" | "strong"
  error?: string
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
  }
} {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      strength: "weak",
      error: "Senha é obrigatória",
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      },
    }
  }

  const requirements = {
    minLength: password.length >= 8 && password.length <= 128,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  // Rejeitar padrões fracos comuns
  const weakPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i,
    /^111111/,
    /^000000/,
    /^admin123/i,
    /^test123/i,
  ]

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      return {
        isValid: false,
        strength: "weak",
        error: "Esta senha é muito comum. Escolha uma senha mais segura.",
        requirements,
      }
    }
  }

  const isValid =
    requirements.minLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumber

  let strength: "weak" | "medium" | "strong" = "weak"

  if (!isValid) {
    return {
      isValid: false,
      strength: "weak",
      error: "Senha deve ter: mínimo 8 caracteres, maiúscula, minúscula e número",
      requirements,
    }
  }

  if (requirements.hasSpecialChar) {
    strength = "strong"
  } else {
    strength = "medium"
  }

  return {
    isValid: true,
    strength,
    requirements,
  }
}
