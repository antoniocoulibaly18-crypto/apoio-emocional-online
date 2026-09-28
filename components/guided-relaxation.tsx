"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Play, Headphones, Wind, Music, Video, Heart, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface GuidedRelaxationProps {
  userName: string
  onClose: () => void
}

export function GuidedRelaxation({ userName, onClose }: GuidedRelaxationProps) {
  const [activeBreathing, setActiveBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const videosScrollRef = useRef<HTMLDivElement>(null)
  const audioScrollRef = useRef<HTMLDivElement>(null)

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 400
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const startBreathingExercise = () => {
    setActiveBreathing(true)
    let phase: "inhale" | "hold" | "exhale" = "inhale"

    const cycle = () => {
      if (phase === "inhale") {
        setBreathingPhase("inhale")
        setTimeout(() => {
          phase = "hold"
          cycle()
        }, 4000)
      } else if (phase === "hold") {
        setBreathingPhase("hold")
        setTimeout(() => {
          phase = "exhale"
          cycle()
        }, 7000)
      } else {
        setBreathingPhase("exhale")
        setTimeout(() => {
          phase = "inhale"
          cycle()
        }, 8000)
      }
    }

    cycle()
  }

  const videos = [
    {
      id: "1",
      title: "Meditação Guiada para Ansiedade",
      duration: "15 min",
      youtubeId: "inpok4MKVLM",
      description: "Técnica de meditação para reduzir ansiedade e estresse",
    },
    {
      id: "2",
      title: "Relaxamento Profundo - Sons da Natureza",
      duration: "20 min",
      youtubeId: "lFcSrYw-ARY",
      description: "Sons relaxantes da natureza para meditação profunda",
    },
    {
      id: "3",
      title: "Meditação para Dormir Melhor",
      duration: "30 min",
      youtubeId: "aEqlQvczMJQ",
      description: "Meditação guiada para uma noite de sono tranquila",
    },
    {
      id: "4",
      title: "Mindfulness - Atenção Plena",
      duration: "10 min",
      youtubeId: "ZToicYcHIOU",
      description: "Exercício de mindfulness para o momento presente",
    },
    {
      id: "5",
      title: "Yoga Nidra - Relaxamento Profundo",
      duration: "25 min",
      youtubeId: "M0u9GST_j3s",
      description: "Técnica de relaxamento profundo através do Yoga Nidra",
    },
    {
      id: "6",
      title: "Meditação para Alívio do Estresse",
      duration: "12 min",
      youtubeId: "z6X5oEIg6Ak",
      description: "Meditação focada em liberar tensões e estresse",
    },
  ]

  const audioSessions = [
    {
      title: "Ondas do Oceano",
      duration: "30 min",
      icon: "🌊",
      description: "Sons suaves das ondas do mar",
      youtubeId: "qsDpNvbvO1A",
    },
    {
      title: "Chuva Tranquila",
      duration: "45 min",
      icon: "🌧️",
      description: "Som relaxante de chuva suave",
      youtubeId: "6CQ8l-G6YX8",
    },
    {
      title: "Floresta Tropical",
      duration: "40 min",
      icon: "🌳",
      description: "Sons da natureza em floresta tropical",
      youtubeId: "Qm846KdZN_c",
    },
    {
      title: "Música Instrumental",
      duration: "35 min",
      icon: "🎵",
      description: "Piano suave e melodias relaxantes",
      youtubeId: "3NycM9lYdRI",
    },
  ]

  const breathingTechniques = [
    {
      name: "Respiração 4-7-8",
      description: "Inspire por 4 segundos, segure por 7, expire por 8",
      benefit: "Reduz ansiedade e ajuda a dormir",
    },
    {
      name: "Respiração Diafragmática",
      description: "Respire profundamente usando o diafragma",
      benefit: "Aumenta oxigenação e relaxamento",
    },
    {
      name: "Respiração Alternada",
      description: "Alterne a respiração entre as narinas",
      benefit: "Equilibra o sistema nervoso",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-2xl">
        <CardHeader className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Relaxamento Guiado</CardTitle>
                <CardDescription>Encontre paz e tranquilidade, {userName}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 overflow-y-auto">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Respiração
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Áudio
              </TabsTrigger>
            </TabsList>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Meditações Guiadas em Vídeo</h3>
                <p className="text-muted-foreground">
                  Escolha uma sessão de meditação guiada para relaxar profundamente
                </p>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(videosScrollRef, "left")}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div
                  ref={videosScrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videos.map((video) => (
                    <Card
                      key={video.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow bg-white/70 flex-shrink-0 w-[450px]"
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        ></iframe>
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </Badge>
                        </div>
                        <CardDescription>{video.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(videosScrollRef, "right")}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </TabsContent>

            {/* Breathing Tab */}
            <TabsContent value="breathing" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Exercícios de Respiração</h3>
                <p className="text-muted-foreground">
                  Técnicas de respiração para acalmar a mente e reduzir o estresse
                </p>
              </div>

              {/* Interactive Breathing Exercise */}
              <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h4 className="text-2xl font-semibold mb-4">Exercício de Respiração 4-7-8</h4>
                    <p className="text-muted-foreground mb-6">Siga o círculo e respire no ritmo indicado</p>

                    <div className="flex flex-col items-center gap-6 mb-8">
                      <div
                        className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000 ${
                          activeBreathing
                            ? breathingPhase === "inhale"
                              ? "bg-blue-400 scale-125"
                              : breathingPhase === "hold"
                                ? "bg-purple-400 scale-125"
                                : "bg-green-400 scale-75"
                            : "bg-blue-300"
                        }`}
                      >
                        <div className="text-white text-center">
                          <Wind className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-xl font-semibold">
                            {activeBreathing
                              ? breathingPhase === "inhale"
                                ? "Inspire"
                                : breathingPhase === "hold"
                                  ? "Segure"
                                  : "Expire"
                              : "Pronto?"}
                          </p>
                        </div>
                      </div>

                      {activeBreathing && (
                        <div className="text-center">
                          <p className="text-lg text-muted-foreground">
                            {breathingPhase === "inhale"
                              ? "Inspire pelo nariz por 4 segundos..."
                              : breathingPhase === "hold"
                                ? "Segure a respiração por 7 segundos..."
                                : "Expire pela boca por 8 segundos..."}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => {
                        if (activeBreathing) {
                          setActiveBreathing(false)
                        } else {
                          startBreathingExercise()
                        }
                      }}
                      className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
                    >
                      {activeBreathing ? "Parar Exercício" : "Iniciar Exercício"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Breathing Techniques */}
              <div className="grid md:grid-cols-3 gap-4">
                {breathingTechniques.map((technique, index) => (
                  <Card key={index} className="bg-white/70 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <Wind className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{technique.name}</CardTitle>
                      <CardDescription className="text-sm">{technique.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                        <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{technique.benefit}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Sons Relaxantes</h3>
                <p className="text-muted-foreground">
                  Áudios de sons da natureza e música instrumental para relaxamento profundo
                </p>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(audioScrollRef, "left")}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div
                  ref={audioScrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {audioSessions.map((session, index) => {
                    const isPlaying = playingAudio === session.title
                    return (
                      <Card
                        key={index}
                        className="bg-white/70 hover:shadow-lg transition-shadow flex-shrink-0 w-[350px]"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-3xl">
                              {session.icon}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{session.title}</CardTitle>
                              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" />
                                {session.duration}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{session.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {isPlaying && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${session.youtubeId}?autoplay=1`}
                                title={session.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2"
                            onClick={() => setPlayingAudio(isPlaying ? null : session.title)}
                          >
                            <Play className="w-4 h-4" />
                            {isPlaying ? "Ocultar Player" : "Reproduzir"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(audioScrollRef, "right")}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Dica para Melhor Experiência</h4>
                      <p className="text-sm text-muted-foreground">
                        Use fones de ouvido, encontre um lugar tranquilo, feche os olhos e permita-se relaxar
                        completamente. Dedique pelo menos 10-15 minutos sem interrupções para obter os melhores
                        resultados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
