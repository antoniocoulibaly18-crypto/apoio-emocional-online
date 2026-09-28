"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, User, Shield, Loader2, CheckCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Conversa, Mensagem, Psicologo } from "@/lib/types-psicologo"

interface PsychologistChatProps {
  userId: string
  userName: string
  onClose: () => void
}

export function PsychologistChat({ userId, userName, onClose }: PsychologistChatProps) {
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

  const [inputValue, setInputValue] = useState("")
  const [conversa, setConversa] = useState<Conversa | null>(null)
  const [psicologo, setPsicologo] = useState<Psicologo | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [enviando, setEnviando] = useState(false)
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const psicologoIdRef = useRef<string | null>(null)

  useEffect(() => {
    psicologoIdRef.current = psicologo?.id ?? null
  }, [psicologo])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  // Cria (ou recupera) a conversa deste usuário ao abrir o chat
  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let ativo = true

    async function iniciar() {
      // Reaproveita uma conversa em aberto recente, se existir
      const { data: existentes, error: erroLeitura } = await client
        .from("conversas")
        .select("*")
        .eq("usuario_id", userId)
        .in("status", ["aguardando", "em_andamento"])
        .order("criado_em", { ascending: false })
        .limit(1)

      if (erroLeitura) {
        console.error("Erro ao buscar conversa:", erroLeitura)
        if (ativo) setErroCarregamento("Não foi possível conectar ao chat. Tente novamente em instantes.")
        return
      }

      let conversaAtual = existentes?.[0] as Conversa | undefined

      if (!conversaAtual) {
        const { data: nova, error } = await client
          .from("conversas")
          .insert({ usuario_id: userId, usuario_nome: userName, status: "aguardando" })
          .select()
          .single()

        if (error) {
          console.error("Erro ao criar conversa:", error)
          if (ativo) setErroCarregamento("Não foi possível iniciar a conversa. Tente novamente em instantes.")
          return
        }
        conversaAtual = nova as Conversa
      }

      if (!ativo) return
      setConversa(conversaAtual)

      const { data: historico } = await client
        .from("mensagens")
        .select("*")
        .eq("conversa_id", conversaAtual.id)
        .order("criado_em", { ascending: true })

      if (ativo) setMensagens((historico as Mensagem[]) || [])

      if (conversaAtual.psicologo_id) {
        const { data: psi } = await client
          .from("psicologos")
          .select("*")
          .eq("id", conversaAtual.psicologo_id)
          .single()
        if (ativo) setPsicologo(psi as Psicologo)
      }
    }

    iniciar()
    return () => {
      ativo = false
    }
  }, [supabase, userId, userName])

  // Assina atualizações em tempo real da conversa e das mensagens
  useEffect(() => {
    if (!conversa || !supabase) return
    const client = supabase

    const canalMensagens = client
      .channel(`mensagens-${conversa.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens", filter: `conversa_id=eq.${conversa.id}` },
        (payload) => {
          setMensagens((prev) => [...prev, payload.new as Mensagem])
        },
      )
      .subscribe()

    const canalConversa = client
      .channel(`conversa-${conversa.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversas", filter: `id=eq.${conversa.id}` },
        async (payload) => {
          const atualizada = payload.new as Conversa
          setConversa(atualizada)
          if (atualizada.psicologo_id && atualizada.psicologo_id !== psicologoIdRef.current) {
            const { data: psi } = await client
              .from("psicologos")
              .select("*")
              .eq("id", atualizada.psicologo_id)
              .single()
            setPsicologo(psi as Psicologo)
          }
        },
      )
      .subscribe()

    return () => {
      client.removeChannel(canalMensagens)
      client.removeChannel(canalConversa)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, conversa?.id])

  const enviarMensagem = useCallback(
    async (texto: string) => {
      if (!conversa || !supabase) return
      setEnviando(true)
      const { error } = await supabase.from("mensagens").insert({
        conversa_id: conversa.id,
        remetente_tipo: "usuario",
        remetente_nome: userName,
        conteudo: texto,
      })
      setEnviando(false)
      if (error) {
        console.error("Erro ao enviar mensagem:", error)
        setErroCarregamento("A mensagem não foi enviada. Verifique sua conexão e tente novamente.")
      }
    },
    [supabase, conversa, userName],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !enviando) {
      enviarMensagem(inputValue.trim())
      setInputValue("")
    }
  }

  const aguardando = !conversa || conversa.status === "aguardando"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col shadow-2xl border-0 bg-gradient-to-br from-blue-50/95 to-purple-50/95 backdrop-blur-md">
        <CardHeader className="border-b bg-white/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {psicologo ? psicologo.nome : "Chat com Psicólogo"}
                  {psicologo ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Online
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Aguardando
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {psicologo ? `Psicólogo(a) • CRP ${psicologo.crp}` : "Um psicólogo real vai atendê-lo(a) em breve"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Conversa Confidencial</p>
              <p className="text-blue-700">
                Você está conversando com um profissional real. Suas informações estão protegidas e não serão
                compartilhadas com terceiros.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {(erroConfig || erroCarregamento) && (
            <div className="flex items-center justify-center h-full text-center">
              <div className="max-w-sm space-y-2">
                <p className="text-sm font-medium text-red-700">
                  {erroConfig ? "O chat não está disponível no momento." : erroCarregamento}
                </p>
                <p className="text-xs text-muted-foreground">
                  {erroConfig
                    ? "Contacte o suporte se o problema continuar."
                    : "Se o problema continuar, feche e tente abrir o chat novamente."}
                </p>
              </div>
            </div>
          )}

          {!erroConfig && !erroCarregamento && aguardando && mensagens.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm max-w-sm">
                Sua mensagem será entregue assim que um psicólogo disponível assumir a conversa. Você pode escrever
                agora mesmo — ela ficará guardada.
              </p>
            </div>
          )}

          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${mensagem.remetente_tipo === "usuario" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                {mensagem.remetente_tipo === "psicologo" && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    mensagem.remetente_tipo === "usuario"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/80 backdrop-blur-sm text-foreground shadow-sm border border-border/50"
                  }`}
                >
                  {mensagem.remetente_tipo === "psicologo" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary">{mensagem.remetente_nome}</span>
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{mensagem.conteudo}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {new Date(mensagem.criado_em).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {mensagem.remetente_tipo === "usuario" && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t bg-white/80 backdrop-blur-sm p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              disabled={enviando || !conversa || !!erroConfig}
              className="flex-1 bg-white/50 border-border/50 focus:bg-white transition-colors"
            />
            <Button type="submit" disabled={!inputValue.trim() || enviando || !conversa || !!erroConfig} className="bg-primary hover:bg-primary/90 px-6">
              {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Conversa com psicólogo real e certificado
          </p>
        </div>
      </Card>
    </div>
  )
}
