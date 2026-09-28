"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Heart, Phone, Mail, Eye, EyeOff, CheckCircle, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { validateName, validateEmail, validatePhone, validatePassword } from "@/lib/validation"

interface ValidationErrors {
  nome?: string
  contacto?: string
  senha?: string
  confirmarSenha?: string
}

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    contacto: "",
    contactoTipo: "email" as "email" | "telefone",
    senha: "",
    confirmarSenha: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("weak")
  const router = useRouter()

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPassword = e.target.value
      setFormData({ ...formData, senha: newPassword })

      const validation = validatePassword(newPassword)
      setPasswordStrength(validation.strength)
    },
    [formData],
  )

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "strong":
        return "bg-green-100 text-green-800"
    }
  }

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case "weak":
        return "Fraca"
      case "medium":
        return "Média"
      case "strong":
        return "Forte"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setValidationErrors({})

    const errors: ValidationErrors = {}

    // Validar Nome
    const nameValidation = validateName(formData.nome)
    if (!nameValidation.isValid) {
      errors.nome = nameValidation.error
    }

    // Validar Contacto (Email ou Telefone)
    if (formData.contactoTipo === "email") {
      const emailValidation = validateEmail(formData.contacto)
      if (!emailValidation.isValid) {
        errors.contacto = emailValidation.error
      }
    } else {
      const phoneValidation = validatePhone(formData.contacto)
      if (!phoneValidation.isValid) {
        errors.contacto = phoneValidation.error
      }
    }

    // Validar Senha
    const passwordValidation = validatePassword(formData.senha)
    if (!passwordValidation.isValid) {
      errors.senha = passwordValidation.error
    }

    // Validar se senhas coincidem
    if (formData.senha !== formData.confirmarSenha) {
      errors.confirmarSenha = "As senhas não coincidem"
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      const result = await AuthService.register({
        nome: formData.nome.trim(),
        contacto: formData.contacto.trim(),
        contactoTipo: formData.contactoTipo,
        senha: formData.senha,
      })

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        setTimeout(() => {
          router.push("/servicos")
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro interno. Tente novamente." })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold text-primary">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            Apoio Emocional Angola
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Criar Conta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Junte-se à nossa comunidade de apoio emocional
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className={`h-12 ${validationErrors.nome ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {validationErrors.nome && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.nome}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tipo de Contacto</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contactoTipo"
                      value="email"
                      checked={formData.contactoTipo === "email"}
                      onChange={(e) =>
                        setFormData({ ...formData, contactoTipo: e.target.value as "email" | "telefone", contacto: "" })
                      }
                      className="text-primary"
                    />
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contactoTipo"
                      value="telefone"
                      checked={formData.contactoTipo === "telefone"}
                      onChange={(e) =>
                        setFormData({ ...formData, contactoTipo: e.target.value as "email" | "telefone", contacto: "" })
                      }
                      className="text-primary"
                    />
                    <Phone className="w-4 h-4" />
                    Telefone
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contacto">{formData.contactoTipo === "email" ? "Email" : "Número de Telefone"}</Label>
                <Input
                  id="contacto"
                  type={formData.contactoTipo === "email" ? "email" : "tel"}
                  placeholder={formData.contactoTipo === "email" ? "seu@email.com" : "+244 900 000 000"}
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  required
                  className={`h-12 ${validationErrors.contacto ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {validationErrors.contacto && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.contacto}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={handlePasswordChange}
                    required
                    className={`h-12 pr-10 ${validationErrors.senha ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.senha && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getPasswordStrengthColor()}`}>
                      Força: {getPasswordStrengthLabel()}
                    </div>
                  </div>
                )}
                {validationErrors.senha && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.senha}
                  </p>
                )}
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Mínimo 8 caracteres com maiúscula, minúscula e número
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    required
                    className={`h-12 pr-10 ${validationErrors.confirmarSenha ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.confirmarSenha && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.confirmarSenha}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Fazer Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
