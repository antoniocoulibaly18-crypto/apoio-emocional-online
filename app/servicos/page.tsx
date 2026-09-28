"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  MessageCircle,
  Bot,
  Headphones,
  FileText,
  Users,
  LogOut,
  User,
  Clock,
  Shield,
  Star,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthService, type UserSession } from "@/lib/auth"
import { EmpatheticChatbot } from "@/components/empathetic-chatbot"
import { PsychologistChat } from "@/components/psychologist-chat"
import { EmotionalAssessment } from "@/components/emotional-assessment"
import { GuidedRelaxation } from "@/components/guided-relaxation"
import { SupportGroups } from "@/components/support-groups"
import { WellnessLibrary } from "@/components/wellness-library"

export default function ServicosPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showChatbot, setShowChatbot] = useState(false)
  const [showPsychologistChat, setShowPsychologistChat] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [showRelaxation, setShowRelaxation] = useState(false)
  const [showSupportGroups, setShowSupportGroups] = useState(false)
  const [showWellnessLibrary, setShowWellnessLibrary] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      router.push("/login")
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [router])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Apoio Emocional Angola</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {getGreeting()}, {user.nome.split(" ")[0]}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {getGreeting()}, {user.nome.split(" ")[0]}! 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Estamos aqui para apoiá-lo em sua jornada emocional. Este é um espaço seguro e acolhedor onde você pode
            encontrar o apoio que precisa.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Psicólogos Online</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Shield className="w-4 h-4" />
              <span>100% Confidencial</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Clock className="w-4 h-4" />
              <span>Disponível 24h</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {/* Conversa com Psicólogo */}
          <Card
            onClick={() => setShowPsychologistChat(true)}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl">Conversa com Psicólogo</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Disponível
                </Badge>
              </div>
              <CardDescription className="text-base">
                Converse anonimamente com psicólogos voluntários qualificados e experientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Profissionais certificados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Conversas 100% anônimas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Resposta em até 5 minutos</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-medium">
                Iniciar Conversa Agora
              </Button>
            </CardContent>
          </Card>

          {/* Chatbot Empático */}
          <Card
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/70 backdrop-blur-sm"
            onClick={() => setShowChatbot(true)}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-10 h-10 text-secondary" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl">Assistente Empático</CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  24h
                </Badge>
              </div>
              <CardDescription className="text-base">
                Apoio emocional imediato através do nosso assistente inteligente treinado em psicologia
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Disponível 24 horas por dia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Respostas empáticas e acolhedoras</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Privacidade garantida</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full h-12 text-base font-medium">
                Conversar com Assistente
              </Button>
            </CardContent>
          </Card>

          {/* Sessões de Relaxamento */}
          <Card
            onClick={() => setShowRelaxation(true)}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="w-10 h-10 text-accent" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl mb-2">Relaxamento Guiado</CardTitle>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Novo
                </Badge>
              </div>
              <CardDescription className="text-base">
                Áudios guiados para meditação, respiração e relaxamento mental profundo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Headphones className="w-4 h-4 text-purple-500" />
                  <span>15+ sessões de relaxamento</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>5-30 minutos por sessão</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Técnicas comprovadas</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent h-12 text-base font-medium hover:bg-accent/10">
                Explorar Sessões
              </Button>
            </CardContent>
          </Card>

          {/* Autoavaliação Emocional */}
          <Card
            onClick={() => setShowAssessment(true)}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl mb-2">Autoavaliação Emocional</CardTitle>
                <CardDescription className="text-base">
                  Questionários científicos para entender melhor seu estado emocional atual
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Questionários validados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Relatório personalizado</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Dados privados e seguros</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-medium">
                Iniciar Avaliação
              </Button>
            </CardContent>
          </Card>

          {/* Grupos de Apoio */}
          <Card
            onClick={() => setShowSupportGroups(true)}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-secondary" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl">Grupos de Apoio</CardTitle>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Ativo
                </Badge>
              </div>
              <CardDescription className="text-base">
                Participe de grupos de apoio com pessoas que passam por situações similares
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>8 grupos ativos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Moderação profissional</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Ambiente acolhedor</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full h-12 text-base font-medium">
                Ver Grupos Disponíveis
              </Button>
            </CardContent>
          </Card>

          {/* Recursos Educativos */}
          <Card
            onClick={() => setShowWellnessLibrary(true)}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-accent" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl mb-2">Biblioteca de Bem-estar</CardTitle>
                <CardDescription className="text-base">
                  Artigos, vídeos e materiais educativos sobre saúde mental e bem-estar
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>50+ artigos especializados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Conteúdo atualizado semanalmente</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Criado por especialistas</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent h-12 text-base font-medium hover:bg-accent/10">
                Explorar Biblioteca
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800 mb-2">Precisa de Ajuda Imediata?</CardTitle>
              <CardDescription className="text-red-700 text-base">
                Se está em crise, pensando em se machucar ou precisa de apoio urgente, não hesite em procurar ajuda
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Emergência Nacional</h4>
                  <p className="text-red-700 text-sm mb-3">Bombeiros, Polícia e Emergências Médicas</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Ligar: 112</Button>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">SOS Voz Amiga</h4>
                  <p className="text-red-700 text-sm mb-3">Apoio emocional e prevenção ao suicídio</p>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    Ligar: 213 544 545
                  </Button>
                </div>
              </div>
              <p className="text-sm text-red-600">
                Lembre-se: Procurar ajuda é um sinal de coragem, não de fraqueza. Você não está sozinho.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg">
            <CardContent className="p-8">
              <blockquote className="text-xl italic text-foreground mb-4">
                "A cura não significa que o dano nunca existiu. Significa que o dano não controla mais nossa vida."
              </blockquote>
              <p className="text-muted-foreground">— Akshay Dubey</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chatbot Component */}
      {showChatbot && (
        <EmpatheticChatbot userId={user.id} userName={user.nome.split(" ")[0]} onClose={() => setShowChatbot(false)} />
      )}

      {/* PsychologistChat Component */}
      {showPsychologistChat && (
        <PsychologistChat
          userId={user.id}
          userName={user.nome.split(" ")[0]}
          onClose={() => setShowPsychologistChat(false)}
        />
      )}

      {/* EmotionalAssessment Component */}
      {showAssessment && (
        <EmotionalAssessment userName={user.nome.split(" ")[0]} onClose={() => setShowAssessment(false)} />
      )}

      {/* GuidedRelaxation Component */}
      {showRelaxation && (
        <GuidedRelaxation userName={user.nome.split(" ")[0]} onClose={() => setShowRelaxation(false)} />
      )}

      {/* SupportGroups Component */}
      {showSupportGroups && (
        <SupportGroups userName={user.nome.split(" ")[0]} onClose={() => setShowSupportGroups(false)} />
      )}

      {/* WellnessLibrary Component */}
      {showWellnessLibrary && (
        <WellnessLibrary userName={user.nome.split(" ")[0]} onClose={() => setShowWellnessLibrary(false)} />
      )}
    </div>
  )
}
