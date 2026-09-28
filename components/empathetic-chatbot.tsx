"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, X, Heart, Loader2, ShieldAlert } from "lucide-react"
import { DefaultChatTransport } from "ai"

interface EmpatheticChatbotProps {
  userId: string
  userName: string
  onClose: () => void
}

export function EmpatheticChatbot({ userId, userName, onClose }: EmpatheticChatbotProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { userId, userName } }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Olá ${userName}, seja muito bem-vindo(a)! 🌸\n\nEu sou o seu assistente de apoio emocional e estou aqui para ouvir você com empatia e sem julgamento. Este é um espaço seguro onde você pode compartilhar seus sentimentos e pensamentos.\n\nComo você está se sentindo hoje?`,
          },
        ],
      },
    ],
  })

  const acionouPsicologo = messages.some((m) =>
    m.parts?.some((p: any) => p.type === "tool-solicitarIntervencaoUrgente"),
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && (status !== "streaming" && status !== "submitted")) {
      sendMessage({ text: inputValue })
      setInputValue("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[600px] flex flex-col shadow-2xl border-0 bg-gradient-to-br from-blue-50/95 to-green-50/95 backdrop-blur-md">
        <CardHeader className="border-b bg-white/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Sátio
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Sempre aqui para ouvir você</p>
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
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {acionouPsicologo && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Um psicólogo humano foi notificado</p>
                <p className="text-amber-700">
                  Um profissional real vai entrar em contacto o mais rápido possível pelo "Chat com Psicólogo" em
                  Serviços. Continue aqui comigo enquanto isso, se quiser.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/80 backdrop-blur-sm text-foreground shadow-sm border border-border/50"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-muted-foreground">Assistente</span>
                  </div>
                )}
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
                        {part.text}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}

          {(status === "streaming" || status === "submitted") && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-border/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  <span className="text-sm text-muted-foreground">Digitando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t bg-white/80 backdrop-blur-sm p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              disabled={(status === "streaming" || status === "submitted")}
              className="flex-1 bg-white/50 border-border/50 focus:bg-white transition-colors"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || (status === "streaming" || status === "submitted")}
              className="bg-primary hover:bg-primary/90 px-6"
            >
              {(status === "streaming" || status === "submitted") ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Este assistente oferece apoio emocional, mas não substitui ajuda profissional
          </p>
        </div>
      </Card>
    </div>
  )
}
