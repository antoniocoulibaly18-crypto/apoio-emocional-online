"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { X, Users, Shield, Heart, Send, UserCircle, Clock, AlertCircle } from "lucide-react"

interface SupportGroupsProps {
  userName: string
  onClose: () => void
}

interface Group {
  id: string
  name: string
  description: string
  category: string
  members: number
  moderator: string
  schedule: string
  color: string
  icon: string
}

interface Message {
  id: string
  user: string
  message: string
  time: string
  isModerator?: boolean
}

const groups: Group[] = [
  {
    id: "geral",
    name: "Apoio Geral",
    description: "Espaço aberto para todos compartilharem suas experiências e receberem apoio emocional",
    category: "Geral",
    members: 127,
    moderator: "Dra. Ana Silva",
    schedule: "Sempre disponível",
    color: "blue",
    icon: "💙",
  },
  {
    id: "deficiencia",
    name: "Vivendo com Deficiência",
    description: "Grupo de apoio para pessoas com deficiência física ou mental e seus familiares",
    category: "Deficiência",
    members: 43,
    moderator: "Dr. João Mendes",
    schedule: "Terças e Quintas, 18h",
    color: "purple",
    icon: "♿",
  },
  {
    id: "bullying",
    name: "Superando o Bullying",
    description: "Apoio para vítimas de bullying, cyberbullying e assédio moral",
    category: "Bullying",
    members: 68,
    moderator: "Psic. Maria Costa",
    schedule: "Segundas e Quartas, 19h",
    color: "orange",
    icon: "🛡️",
  },
  {
    id: "luto",
    name: "Lidando com o Luto",
    description: "Espaço acolhedor para quem perdeu entes queridos e precisa de apoio no processo de luto",
    category: "Luto",
    members: 52,
    moderator: "Dra. Teresa Nunes",
    schedule: "Quartas e Sextas, 17h",
    color: "gray",
    icon: "🕊️",
  },
  {
    id: "desemprego",
    name: "Desemprego e Recomeço",
    description: "Apoio emocional para quem enfrenta desemprego e busca reconstruir sua vida profissional",
    category: "Carreira",
    members: 89,
    moderator: "Dr. Carlos Ferreira",
    schedule: "Terças e Sábados, 16h",
    color: "green",
    icon: "💼",
  },
  {
    id: "familia",
    name: "Conflitos Familiares",
    description: "Grupo para discutir e encontrar apoio em situações de conflito familiar e relacionamentos",
    category: "Família",
    members: 76,
    moderator: "Psic. Beatriz Santos",
    schedule: "Segundas e Quintas, 20h",
    color: "pink",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "ansiedade",
    name: "Ansiedade e Pânico",
    description: "Compartilhe experiências e técnicas para lidar com ansiedade e ataques de pânico",
    category: "Ansiedade",
    members: 134,
    moderator: "Dr. Paulo Rodrigues",
    schedule: "Diariamente, 21h",
    color: "yellow",
    icon: "😰",
  },
  {
    id: "autoestima",
    name: "Construindo Autoestima",
    description: "Grupo focado em desenvolver autoconfiança, amor próprio e autoaceitação",
    category: "Desenvolvimento",
    members: 95,
    moderator: "Psic. Luísa Martins",
    schedule: "Quartas e Domingos, 15h",
    color: "teal",
    icon: "✨",
  },
]

const sampleMessages: Message[] = [
  {
    id: "1",
    user: "Moderador",
    message: "Bem-vindo ao grupo! Este é um espaço seguro e acolhedor. Sinta-se à vontade para compartilhar.",
    time: "14:30",
    isModerator: true,
  },
  {
    id: "2",
    user: "Ana M.",
    message: "Olá a todos! É a primeira vez que participo de um grupo assim. Estou um pouco nervosa.",
    time: "14:32",
  },
  {
    id: "3",
    user: "Carlos S.",
    message: "Seja bem-vinda, Ana! Todos nós já passamos por isso. Você está em um lugar seguro.",
    time: "14:33",
  },
  {
    id: "4",
    user: "Moderador",
    message: "Lembre-se: aqui não há julgamentos. Cada história é válida e importante.",
    time: "14:35",
    isModerator: true,
  },
]

export function SupportGroups({ userName, onClose }: SupportGroupsProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: userName,
        message: newMessage,
        time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
      orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
      gray: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
      green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
      pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
      yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
      teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col bg-white shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Grupos de Apoio</CardTitle>
                <CardDescription>Conecte-se com pessoas que entendem sua jornada</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          {!selectedGroup ? (
            <div className="h-full overflow-auto p-6">
              {/* Guidelines */}
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900 mb-2">Diretrizes do Grupo</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Respeite todos os membros e suas experiências</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Mantenha a confidencialidade - o que é compartilhado aqui, fica aqui</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Evite dar conselhos médicos - compartilhe experiências pessoais</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Seja empático e acolhedor com novos membros</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Groups Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {groups.map((group) => {
                  const colorClasses = getColorClasses(group.color)
                  return (
                    <Card
                      key={group.id}
                      className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${colorClasses.border}`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`text-4xl ${colorClasses.bg} w-16 h-16 rounded-full flex items-center justify-center`}
                          >
                            {group.icon}
                          </div>
                          <Badge className={`${colorClasses.bg} ${colorClasses.text} border-0`}>
                            {group.members} membros
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{group.name}</CardTitle>
                        <CardDescription className="text-base">{group.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserCircle className="w-4 h-4" />
                            <span>
                              <strong>Moderador:</strong> {group.moderator}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              <strong>Horário:</strong> {group.schedule}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-600 font-medium">Grupo Ativo</span>
                          </div>
                        </div>
                        <Button className={`w-full mt-4 ${colorClasses.bg} ${colorClasses.text} hover:opacity-90`}>
                          Entrar no Grupo
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Group Header */}
              <div className={`p-4 border-b ${getColorClasses(selectedGroup.color).bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGroup(null)}
                    className="hover:bg-white/50"
                  >
                    ← Voltar aos Grupos
                  </Button>
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    {selectedGroup.members} online
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedGroup.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedGroup.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Moderado por {selectedGroup.moderator} • {selectedGroup.schedule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.user === userName ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.isModerator
                            ? "bg-gradient-to-br from-primary to-secondary"
                            : msg.user === userName
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : "bg-gradient-to-br from-gray-300 to-gray-400"
                        }`}
                      >
                        {msg.isModerator ? (
                          <Shield className="w-5 h-5 text-white" />
                        ) : (
                          <UserCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${msg.user === userName ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {msg.user}
                            {msg.isModerator && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary">
                                Moderador
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            msg.isModerator
                              ? "bg-primary/10 text-primary"
                              : msg.user === userName
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-foreground"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="max-w-4xl mx-auto flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={handleSendMessage} className="px-6">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Lembre-se: este é um espaço seguro e confidencial. Seja respeitoso e empático.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
