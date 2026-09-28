"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Heart, Eye, EyeOff, CheckCircle, AlertCircle, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { useBruteForceProtection } from "@/hooks/useBruteForceProtection"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    contacto: "",
    senha: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(0)
  const router = useRouter()
  const bruteForce = useBruteForceProtection()

  useEffect(() => {
    // Atualizar tempo de bloqueio restante
    if (bruteForce.isLocked) {
      const updateTimer = setInterval(() => {
        const remaining = bruteForce.getRemainingLockTime()
        setLockTimeRemaining(remaining)

        if (remaining <= 0) {
          clearInterval(updateTimer)
          // Força uma atualização do estado (reset)
          window.location.reload()
        }
      }, 1000)

      return () => clearInterval(updateTimer)
    }
  }, [bruteForce.isLocked])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Verificar se está bloqueado por força bruta
    if (bruteForce.isLocked) {
      const lockMessage = bruteForce.getLockedMessage()
      setMessage({
        type: "error",
        text: lockMessage || "Acesso bloqueado temporariamente. Tente novamente em alguns minutos.",
      })
      setIsLoading(false)
      return
    }

    try {
      const result = await AuthService.login(formData.contacto.trim(), formData.senha)

      if (result.success) {
        // Login bem-sucedido, reset das tentativas
        bruteForce.resetAttempts()
        setMessage({ type: "success", text: result.message })
        setTimeout(() => {
          router.push("/servicos")
        }, 1500)
      } else {
        // Login falhou, registrar tentativa
        bruteForce.recordFailedAttempt()
        setMessage({ type: "error", text: result.message })

        // Se ainda há tentativas, mostrar aviso
        if (bruteForce.remainingAttempts > 0) {
          setMessage({
            type: "error",
            text: `${result.message} (${bruteForce.remainingAttempts} tentativa${bruteForce.remainingAttempts > 1 ? "s" : ""} restante${bruteForce.remainingAttempts > 1 ? "s" : ""})`,
          })
        } else {
          setMessage({
            type: "error",
            text: "Muitas tentativas falhadas. Acesso bloqueado por 30 minutos.",
          })
        }
      }
    } catch (error) {
      bruteForce.recordFailedAttempt()
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
            <CardTitle className="text-2xl text-foreground">Entrar</CardTitle>
            <CardDescription className="text-muted-foreground">Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            {bruteForce.isLocked && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-orange-50 text-orange-800 border border-orange-200">
                <Lock className="w-4 h-4" />
                <div className="text-sm">
                  <p className="font-medium">Acesso temporariamente bloqueado</p>
                  <p className="text-xs mt-1">
                    Por segurança, sua conta foi bloqueada por {Math.ceil(lockTimeRemaining / 60000)} minuto
                    {Math.ceil(lockTimeRemaining / 60000) > 1 ? "s" : ""} após múltiplas tentativas falhadas.
                  </p>
                </div>
              </div>
            )}

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

            <form onSubmit={handleSubmit} className="space-y-4" disabled={bruteForce.isLocked}>
              <div className="space-y-2">
                <Label htmlFor="contacto">Email ou Telefone</Label>
                <Input
                  id="contacto"
                  type="text"
                  placeholder="Digite seu email ou telefone"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90"
                disabled={isLoading || bruteForce.isLocked}
              >
                {isLoading ? "Entrando..." : bruteForce.isLocked ? "Acesso Bloqueado" : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-primary hover:underline font-medium">
                  Criar Conta
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
