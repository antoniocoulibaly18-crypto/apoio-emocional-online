"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Conversa, Mensagem, Psicologo } from "@/lib/types-psicologo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LogOut, Send, Loader2, Clock, MessageCircle, AlertTriangle } from "lucide-react"

export default function PsicologoDashboardPage() {
  const clientRef = useRef<{ client: ReturnType<typeof createClient> | null; erro: string | null }>()
  if (!clientRef.current) {
    try {
      clientRef.current = { client: createClient(), erro: null }
    } catch (err) {
      clientRef.current = { client: null, erro: err instanceof Error ? err.message : "Erro ao conectar ao servidor." }
    }
  }
  const supabase = clientRef.current.client
  const erroConfig = clientRef.current.erro
  const router = useRouter()

  const [psicologo, setPsicologo] = useState<Psicologo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [inputValue, setInputValue] = useState("")
  const [enviando, setEnviando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Verifica sessão e carrega perfil do psicólogo
  useEffect(() => {
    if (!supabase) {
      setCarregando(false)
      return
    }
    const client = supabase

    async function carregar() {
      const {
        data: { user },
        error: erroAuth,
      } = await client.auth.getUser()

      if (erroAuth) {
        console.error("Erro ao verificar sessão:", erroAuth)
        setErroCarregamento("Não foi possível verificar sua sessão. Tente entrar novamente.")
        setCarregando(false)
        return
      }

      if (!user) {
        router.push("/psicologo/login")
        return
      }

      const { data: perfil, error: erroPerfil } = await client.from("psicologos").select("*").eq("id", user.id).single()

      if (erroPerfil || !perfil) {
        console.error("Erro ao carregar perfil:", erroPerfil)
        setErroCarregamento("Não foi possível carregar seu perfil. Tente entrar novamente.")
        setCarregando(false)
        return
      }

      setPsicologo(perfil as Psicologo)
      setCarregando(false)
    }
    carregar()
  }, [supabase, router])

  // Lista conversas aguardando + as já atribuídas a este psicólogo
  useEffect(() => {
    if (!psicologo || !supabase) return
    const client = supabase

    async function carregarConversas() {
      const { data, error } = await client
        .from("conversas")
        .select("*")
        .in("status", ["aguardando", "em_andamento"])
        .order("criado_em", { ascending: true })
      if (error) {
        console.error("Erro ao carregar conversas:", error)
        setErroCarregamento("Não foi possível carregar as conversas.")
        return
      }
      const ordenadas = ((data as Conversa[]) || []).sort((a, b) => {
        if (a.prioridade !== b.prioridade) return a.prioridade === "urgente" ? -1 : 1
        return new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()
      })
      setConversas(ordenadas)
    }
    carregarConversas()

    const canal = client
      .channel("conversas-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversas" }, () => carregarConversas())
      .subscribe()

    return () => {
      client.removeChannel(canal)
    }
  }, [supabase, psicologo])

  // Mensagens da conversa aberta no momento
  useEffect(() => {
    if (!conversaSelecionada || !supabase) return
    const client = supabase
    const conversaId = conversaSelecionada.id

    async function carregarMensagens() {
      const { data, error } = await client
        .from("mensagens")
        .select("*")
        .eq("conversa_id", conversaId)
        .order("criado_em", { ascending: true })
      if (error) {
        console.error("Erro ao carregar mensagens:", error)
        setErroCarregamento("Não foi possível carregar as mensagens desta conversa.")
        return
      }
      setMensagens((data as Mensagem[]) || [])
    }
    carregarMensagens()

    const canal = client
      .channel(`dashboard-mensagens-${conversaSelecionada.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens",
          filter: `conversa_id=eq.${conversaSelecionada.id}`,
        },
        (payload) => setMensagens((prev) => [...prev, payload.new as Mensagem]),
      )
      .subscribe()

    return () => {
      client.removeChannel(canal)
    }
  }, [supabase, conversaSelecionada])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  const assumirConversa = async (conversa: Conversa) => {
    if (!psicologo || !supabase) return
    const { error } = await supabase
      .from("conversas")
      .update({ psicologo_id: psicologo.id, status: "em_andamento" })
      .eq("id", conversa.id)
    if (error) {
      console.error("Erro ao assumir conversa:", error)
      setErroCarregamento("Não foi possível assumir esta conversa. Tente novamente.")
      return
    }
    setConversaSelecionada({ ...conversa, psicologo_id: psicologo.id, status: "em_andamento" })
  }

  const encerrarConversa = async (conversa: Conversa) => {
    if (!supabase) return
    const { error } = await supabase.from("conversas").update({ status: "encerrada" }).eq("id", conversa.id)
    if (error) {
      console.error("Erro ao encerrar conversa:", error)
      setErroCarregamento("Não foi possível encerrar esta conversa. Tente novamente.")
      return
    }
    setConversaSelecionada(null)
  }

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !conversaSelecionada || !psicologo || !supabase) return
    setEnviando(true)
    const { error } = await supabase.from("mensagens").insert({
      conversa_id: conversaSelecionada.id,
      remetente_tipo: "psicologo",
      remetente_nome: psicologo.nome,
      conteudo: inputValue.trim(),
    })
    if (error) {
      console.error("Erro ao enviar mensagem:", error)
      setErroCarregamento("A mensagem não foi enviada. Tente novamente.")
    }
    setInputValue("")
    setEnviando(false)
  }

  const sair = async () => {
    if (!supabase) {
      router.push("/psicologo/login")
      return
    }
    await supabase.auth.signOut()
    router.push("/psicologo/login")
  }

  if (erroConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>O painel não está disponível</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Não foi possível conectar ao servidor. Contacte o suporte técnico.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (psicologo && !psicologo.ativo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Conta em análise</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <p>
              O seu cadastro como psicólogo(a) foi recebido e está a aguardar aprovação de um administrador. Volte a
              tentar mais tarde.
            </p>
            <Button variant="outline" onClick={sair} className="w-full bg-transparent">
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {erroCarregamento && (
        <div className="bg-red-50 border-b border-red-200 text-red-800 text-sm px-4 py-2 flex items-center justify-between">
          <span>{erroCarregamento}</span>
          <button onClick={() => setErroCarregamento(null)} className="text-red-600 hover:underline">
            Fechar
          </button>
        </div>
      )}
      <div className="flex-1 flex min-h-0">
      {/* Fila de conversas */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">{psicologo?.nome}</p>
            <p className="text-xs text-muted-foreground">CRP {psicologo?.crp}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={sair}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversas.length === 0 && (
            <p className="text-sm text-muted-foreground text-center p-6">Nenhuma conversa no momento.</p>
          )}
          {conversas.map((conversa) => (
            <button
              key={conversa.id}
              onClick={() => setConversaSelecionada(conversa)}
              className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                conversaSelecionada?.id === conversa.id ? "bg-muted" : ""
              } ${conversa.prioridade === "urgente" ? "border-l-4 border-l-red-500 bg-red-50/50" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{conversa.usuario_nome}</span>
                {conversa.prioridade === "urgente" ? (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgente
                  </Badge>
                ) : conversa.status === "aguardando" ? (
                  <Badge className="bg-amber-100 text-amber-800 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Novo
                  </Badge>
                ) : conversa.psicologo_id === psicologo?.id ? (
                  <Badge className="bg-green-100 text-green-800 text-xs">Sua conversa</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Em atendimento
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(conversa.criado_em).toLocaleString("pt-AO")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Janela de chat */}
      <div className="flex-1 flex flex-col">
        {!conversaSelecionada ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <MessageCircle className="w-8 h-8" />
            <p className="text-sm">Selecione uma conversa na lista à esquerda</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{conversaSelecionada.usuario_nome}</p>
                  {conversaSelecionada.prioridade === "urgente" && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Urgente
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {conversaSelecionada.status === "aguardando" ? "Aguardando atendimento" : "Em atendimento"}
                  {conversaSelecionada.origem === "assistente_ia" && " • sinalizada pelo Assistente de IA"}
                </p>
              </div>
              <div className="flex gap-2">
                {conversaSelecionada.status === "aguardando" && (
                  <Button size="sm" onClick={() => assumirConversa(conversaSelecionada)}>
                    Assumir conversa
                  </Button>
                )}
                {conversaSelecionada.status === "em_andamento" && conversaSelecionada.psicologo_id === psicologo?.id && (
                  <Button size="sm" variant="outline" onClick={() => encerrarConversa(conversaSelecionada)}>
                    Encerrar
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`flex ${mensagem.remetente_tipo === "psicologo" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      mensagem.remetente_tipo === "psicologo"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white shadow-sm border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(mensagem.criado_em).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={enviarMensagem} className="p-4 border-t bg-white flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escreva sua resposta..."
                disabled={enviando || conversaSelecionada.status !== "em_andamento" || conversaSelecionada.psicologo_id !== psicologo?.id}
              />
              <Button
                type="submit"
                disabled={
                  !inputValue.trim() ||
                  enviando ||
                  conversaSelecionada.status !== "em_andamento" ||
                  conversaSelecionada.psicologo_id !== psicologo?.id
                }
              >
                {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </>
        )}
      </div>
      </div>
    </div>
  )
}
