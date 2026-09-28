"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Stethoscope, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function PsicologoLoginPage() {
  const [modo, setModo] = useState<"login" | "cadastro">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nome: "",
    crp: "",
    email: "",
    senha: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.senha,
    })

    if (error) {
      setMessage({ type: "error", text: "Email ou senha incorretos." })
      setIsLoading(false)
      return
    }

    router.push("/psicologo/dashboard")
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!formData.nome.trim() || !formData.crp.trim()) {
      setMessage({ type: "error", text: "Preencha nome e número de registo (CRP)." })
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.senha,
    })

    if (error || !data.user) {
      setMessage({ type: "error", text: error?.message || "Não foi possível criar a conta." })
      setIsLoading(false)
      return
    }

    const { error: perfilError } = await supabase.from("psicologos").insert({
      id: data.user.id,
      nome: formData.nome.trim(),
      crp: formData.crp.trim(),
      ativo: false, // fica pendente até um administrador aprovar
    })

    if (perfilError) {
      setMessage({ type: "error", text: "Conta criada, mas houve um erro ao salvar o perfil. Contacte o suporte." })
      setIsLoading(false)
      return
    }

    setMessage({
      type: "success",
      text: "Cadastro enviado! Sua conta será revisada por um administrador antes de ficar ativa.",
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold text-primary">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            Área do Psicólogo
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">{modo === "login" ? "Entrar" : "Cadastrar-se"}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {modo === "login"
                ? "Acesse o painel para atender conversas"
                : "Crie sua conta profissional (sujeita a aprovação)"}
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

            <form onSubmit={modo === "login" ? handleLogin : handleCadastro} className="space-y-4">
              {modo === "cadastro" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crp">Número de registo profissional (CRP)</Label>
                    <Input
                      id="crp"
                      value={formData.crp}
                      onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required
                    minLength={6}
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

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {modo === "login" ? "Ainda não tem uma conta profissional? " : "Já tem uma conta? "}
                <button
                  type="button"
                  onClick={() => {
                    setModo(modo === "login" ? "cadastro" : "login")
                    setMessage(null)
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {modo === "login" ? "Cadastrar-se" : "Entrar"}
                </button>
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
