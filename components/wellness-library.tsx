"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  BookOpen,
  FileText,
  Video,
  Music,
  Mic,
  Play,
  ExternalLink,
  Heart,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface WellnessLibraryProps {
  userName: string
  onClose: () => void
}

export function WellnessLibrary({ userName, onClose }: WellnessLibraryProps) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [selectedPoem, setSelectedPoem] = useState<string | null>(null)

  const videosScrollRef = useRef<HTMLDivElement>(null)
  const musicScrollRef = useRef<HTMLDivElement>(null)
  const podcastsScrollRef = useRef<HTMLDivElement>(null)

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 400
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // IDs do vídeo/faixa/programa atualmente a tocar em cada separador —
  // permite reproduzir tudo num leitor incorporado, sem sair da plataforma.
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null)

  const books = [
    {
      id: "1",
      title: "O Poder do Agora",
      author: "Eckhart Tolle",
      description: "Um guia para a iluminação espiritual",
      content: `O Poder do Agora é um livro transformador que nos ensina a viver no momento presente. Eckhart Tolle nos mostra que o passado já passou e o futuro ainda não chegou - tudo o que temos é o agora.

A mente humana tem a tendência de viver no passado ou no futuro, criando ansiedade e depressão. Quando aprendemos a estar presentes, descobrimos uma paz profunda que sempre esteve dentro de nós.

Principais ensinamentos:
- O momento presente é tudo o que existe
- A mente não é quem você é
- Aceitar o que é traz paz interior
- O ego é a fonte do sofrimento
- A consciência é a chave para a liberdade

Prática diária: Pare por um momento. Respire fundo. Sinta seu corpo. Ouça os sons ao seu redor. Este é o poder do agora.`,
      category: "Autoajuda",
    },
    {
      id: "2",
      title: "Inteligência Emocional",
      author: "Daniel Goleman",
      description: "Por que ela pode ser mais importante que o QI",
      content: `A Inteligência Emocional revolucionou nossa compreensão sobre o sucesso e a felicidade. Daniel Goleman demonstra que nossas emoções desempenham um papel muito maior em nosso pensamento, tomada de decisões e sucesso individual do que se reconhecia anteriormente.

Os cinco pilares da Inteligência Emocional:

1. Autoconsciência: Conhecer suas próprias emoções
2. Autorregulação: Gerenciar suas emoções
3. Motivação: Usar emoções para alcançar objetivos
4. Empatia: Reconhecer emoções nos outros
5. Habilidades sociais: Gerenciar relacionamentos

Pessoas com alta inteligência emocional são mais felizes, têm relacionamentos melhores e são mais bem-sucedidas profissionalmente. A boa notícia é que a inteligência emocional pode ser desenvolvida em qualquer idade.`,
      category: "Psicologia",
    },
    {
      id: "3",
      title: "Mindfulness para Iniciantes",
      author: "Jon Kabat-Zinn",
      description: "Recapture o momento presente e sua vida",
      content: `Mindfulness é a prática de estar presente e totalmente engajado com o que estamos fazendo no momento - livre de distração ou julgamento, e consciente de nossos pensamentos e sentimentos sem ficar preso neles.

Jon Kabat-Zinn, pioneiro do mindfulness no Ocidente, nos ensina que a atenção plena não é sobre esvaziar a mente, mas sobre estar presente com o que quer que surja.

Práticas básicas de Mindfulness:

- Respiração consciente: Observe sua respiração sem tentar mudá-la
- Body scan: Escaneie seu corpo da cabeça aos pés
- Caminhada consciente: Preste atenção em cada passo
- Alimentação consciente: Saboreie cada mordida
- Meditação sentada: Observe pensamentos sem julgamento

Benefícios comprovados:
- Redução do estresse e ansiedade
- Melhora do foco e concentração
- Maior bem-estar emocional
- Melhor qualidade do sono
- Fortalecimento do sistema imunológico`,
      category: "Meditação",
    },
    {
      id: "4",
      title: "A Coragem de Ser Imperfeito",
      author: "Brené Brown",
      description: "Como aceitar a própria vulnerabilidade",
      content: `Brené Brown, pesquisadora de vulnerabilidade e vergonha, nos ensina que a imperfeição não é inadequação - é ser humano. A coragem de ser imperfeito é a coragem de ser você mesmo.

Principais descobertas:

Vulnerabilidade não é fraqueza: É a medida mais precisa de coragem. Quando nos permitimos ser vistos, realmente vistos, criamos conexões autênticas.

Vergonha vs. Culpa: A culpa diz "eu fiz algo ruim", a vergonha diz "eu sou ruim". A culpa pode ser produtiva, a vergonha é destrutiva.

Wholehearted Living (Viver de Coração Inteiro):
- Cultivar autenticidade
- Praticar autocompaixão
- Desenvolver resiliência
- Expressar gratidão
- Abraçar a criatividade
- Descansar e brincar

Lembre-se: Você é digno de amor e pertencimento exatamente como você é. Sua imperfeição é o que te torna único e belo.`,
      category: "Autoestima",
    },
  ]

  const poems = [
    {
      id: "1",
      title: "Não Te Rендas",
      author: "Mario Benedetti",
      content: `Não te rendas, ainda estás a tempo
De alcançar e começar de novo,
Aceitar as tuas sombras,
Enterrar os teus medos,
Libertar o lastro,
Retomar o voo.

Não te rendas que a vida é isso,
Continuar a viagem,
Perseguir os teus sonhos,
Destravar o tempo,
Correr os escombros,
E destapar o céu.

Não te rendas, por favor não cedas,
Ainda que o frio queime,
Ainda que o medo morda,
Ainda que o sol se esconda,
E se cale o vento,
Ainda há fogo na tua alma
Ainda há vida nos teus sonhos.

Porque a vida é tua e teu também o desejo
Porque o esperaste e porque te amo
Porque existe o vinho e o amor, é certo.
Porque não há feridas que o tempo não cure.

Abrir as portas,
Remover os ferrolhos,
Abandonar as muralhas que te protegeram,
Viver a vida e aceitar o desafio,
Recuperar o riso,
Ensaiar a canção,
Baixar a guarda e estender as mãos
Desdobrar as asas
E tentar de novo,
Celebrar a vida e retomar os céus.

Não te rendas, por favor não cedas,
Ainda que o frio queime,
Ainda que o medo morda,
Ainda que o sol se ponha e se cale o vento,
Ainda há fogo na tua alma,
Ainda há vida nos teus sonhos
Porque cada dia é um começo novo,
Porque esta é a hora e o melhor momento.

Porque não estás só, porque eu te amo.`,
    },
    {
      id: "2",
      title: "Invictus",
      author: "William Ernest Henley",
      content: `Das profundezas da noite que me cobre,
Negra como o abismo de lado a lado,
Agradeço aos deuses que existem
Por minha alma inconquistável.

Nas garras cruéis das circunstâncias
Não me lamentei nem gritei.
Sob os golpes do acaso
Minha cabeça sangra, mas não se curva.

Além deste lugar de ira e lágrimas
Paira apenas o Horror das sombras,
E ainda assim a ameaça dos anos
Me encontra, e me encontrará, sem medo.

Não importa quão estreito o portão,
Quão carregada de castigos a sentença,
Eu sou o senhor do meu destino:
Eu sou o capitão da minha alma.`,
    },
    {
      id: "3",
      title: "Amar",
      author: "Florbela Espanca",
      content: `Eu quero amar, amar perdidamente!
Amar só por amar: Aqui... além...
Mais Este e Aquele, o Outro e toda a gente...
Amar! Amar! E não amar ninguém!

Recordar? Esquecer? Indiferente!...
Prender ou desprender? É mal? É bem?
Quem disser que se pode amar alguém
Durante a vida inteira é porque mente!

Há uma Primavera em cada vida:
É preciso cantá-la assim florida,
Pois se Deus nos deu voz, foi pra cantar!

E se um dia hei-de ser pó, cinza e nada
Que seja a minha noite uma alvorada,
Que me saiba perder... pra me encontrar...`,
    },
    {
      id: "4",
      title: "Ser Feliz",
      author: "Clarice Lispector",
      content: `Ser feliz sem motivo é a mais autêntica forma de felicidade.

Não dependa de nada nem de ninguém para ser feliz.
Seja feliz porque a vida é uma dádiva.
Seja feliz porque você respira, porque você existe.

A felicidade não está no fim da jornada,
mas em cada passo que você dá.
Não espere ser feliz amanhã,
seja feliz hoje.

Ser feliz é reconhecer que vale a pena viver,
apesar de todos os desafios, incompreensões e períodos de crise.

Ser feliz é deixar de ser vítima dos problemas
e se tornar um autor da própria história.

É atravessar desertos fora de si,
mas ser capaz de encontrar um oásis
no recôndito da sua alma.

É agradecer a Deus a cada manhã
pelo milagre da vida.

Ser feliz é não ter medo dos próprios sentimentos.
É saber falar de si mesmo.
É ter coragem para ouvir um "não".
É ter segurança para receber uma crítica,
mesmo que injusta.

Ser feliz é deixar viver a criança livre,
alegre e simples que mora dentro de cada um de nós.`,
    },
  ]

  const videos = [
    {
      id: "1",
      title: "A Importância da Saúde Mental",
      creator: "TEDx",
      youtubeId: "c_E0F9PajgA",
      description: "Reflexões profundas sobre cuidar da mente",
      duration: "15:30",
    },
    {
      id: "2",
      title: "Como Lidar com a Ansiedade",
      creator: "TEDx",
      youtubeId: "BsA2yN37cCg",
      description: "Estratégias práticas para controlar a ansiedade",
      duration: "12:45",
    },
    {
      id: "3",
      title: "Autoestima e Amor Próprio",
      creator: "TEDx",
      youtubeId: "CQcvXlZbW7k",
      description: "Construindo uma relação saudável consigo mesmo",
      duration: "18:20",
    },
    {
      id: "4",
      title: "Superando a Depressão",
      creator: "TEDx",
      youtubeId: "rhvYv9LtnGo",
      description: "Histórias reais de superação e esperança",
      duration: "20:15",
    },
    {
      id: "5",
      title: "Mindfulness no Dia a Dia",
      creator: "Palestra convidada",
      youtubeId: "DXXD0Jock9I",
      description: "Práticas simples de atenção plena",
      duration: "10:30",
    },
    {
      id: "6",
      title: "Resiliência Emocional",
      creator: "Palestra convidada",
      youtubeId: "TKaBh_eKBlc",
      description: "Como se fortalecer emocionalmente",
      duration: "16:40",
    },
  ]

  const music = [
    {
      id: "1",
      title: "Almas",
      artist: "BK'",
      album: "Gigantes",
      youtubeId: "Edt78XTnSWk",
      description: "Uma reflexão profunda sobre autoconhecimento",
      genre: "Rap/Hip-Hop",
    },
    {
      id: "2",
      title: "Titãs",
      artist: "BK'",
      album: "Gigantes",
      youtubeId: "EEAXwK1luWo",
      description: "Sobre força interior e superação",
      genre: "Rap/Hip-Hop",
    },
    {
      id: "3",
      title: "Tempo",
      artist: "Leal",
      album: "Visceral",
      youtubeId: "is_hmhRD5D0",
      description: "A importância de dar tempo ao tempo",
      genre: "Rap",
    },
    {
      id: "4",
      title: "Julius",
      artist: "BK'",
      album: "Gigantes",
      youtubeId: "A_6Kgfwo2MM",
      description: "Sobre erguer-se apesar das dificuldades",
      genre: "Rap/Hip-Hop",
    },
    {
      id: "5",
      title: "Alright",
      artist: "Kendrick Lamar",
      album: "To Pimp a Butterfly",
      youtubeId: "Z-48u_uWMHY",
      description: "Hino de esperança e resiliência",
      genre: "Hip-Hop",
    },
    {
      id: "6",
      title: "i",
      artist: "Kendrick Lamar",
      album: "To Pimp a Butterfly",
      youtubeId: "8aShfolR6w8",
      description: "Sobre amor próprio e autoaceitação",
      genre: "Hip-Hop",
    },
    {
      id: "7",
      title: "Our Journey",
      artist: "Peder B. Helland",
      album: "Relaxing Piano Music",
      youtubeId: "3NycM9lYdRI",
      description: "Música instrumental para reflexão",
      genre: "Lo-fi/Ambient",
    },
    {
      id: "8",
      title: "10 Hours of Relaxing Music",
      artist: "Soothing Relaxation",
      album: "Calm Piano & Guitar",
      youtubeId: "8WVXk0Gz66E",
      description: "Sons relaxantes para meditação",
      genre: "Lo-fi/Ambient",
    },
  ]

  const podcasts = [
    {
      id: "1",
      title: "Mamilos",
      host: "Cris Bartis e Ju Wallauer",
      description: "Discussões profundas sobre temas atuais, incluindo saúde mental e bem-estar",
      episodes: "Vários episódios",
      platform: "Spotify",
      spotifyShowId: "39IqvZCSC52QAehb4b4aaR",
    },
    {
      id: "2",
      title: "Isto é Psicologia",
      host: "Ordem dos Psicólogos Portugueses",
      description: "Conversas quinzenais sobre emoções e comportamentos no quotidiano",
      episodes: "Vários episódios",
      platform: "Spotify",
      spotifyShowId: "1CYBYeLoFoM1Mn8gSI9TSE",
    },
    {
      id: "3",
      title: "Saúde Mental em Evidência",
      host: "Jan Luiz Leonardi",
      description: "Conversas simples, atuais e científicas sobre saúde mental",
      episodes: "Vários episódios",
      platform: "Spotify",
      spotifyShowId: "1VREgmRWFJHMuAKobz4PG7",
    },
    {
      id: "4",
      title: "A Voz da Ansiedade",
      host: "Sara Crispim, Psicóloga Clínica",
      description: "Como a ansiedade impacta a sua vida e o que fazer quanto a isso",
      episodes: "Vários episódios",
      platform: "Spotify",
      spotifyShowId: "3jPjZgvoXyGQEDvecmPs9y",
    },
    {
      id: "5",
      title: "Tratando Sua Ansiedade",
      host: "Laura Tomasini Potrich",
      description: "Dicas e insights para controlar a ansiedade e viver de forma mais leve",
      episodes: "Vários episódios",
      platform: "Spotify",
      spotifyShowId: "2ChmAxHXJtF9n6cw1lkKdB",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-2xl">
        <CardHeader className="border-b bg-white/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Biblioteca de Bem-estar
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Recursos educativos para sua jornada de bem-estar emocional
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="books" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mb-4 bg-white/70">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Livros
              </TabsTrigger>
              <TabsTrigger value="poems" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Poemas
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Músicas
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Podcasts
              </TabsTrigger>
            </TabsList>

            {/* Books Tab */}
            <TabsContent value="books" className="flex-1 space-y-4">
              {selectedBook ? (
                <div className="space-y-4">
                  <Button variant="ghost" onClick={() => setSelectedBook(null)} className="mb-4 hover:bg-primary/10">
                    ← Voltar aos livros
                  </Button>
                  {books
                    .filter((book) => book.id === selectedBook)
                    .map((book) => (
                      <div key={book.id} className="space-y-4">
                        <div>
                          <h2 className="text-3xl font-bold text-foreground mb-2">{book.title}</h2>
                          <p className="text-lg text-muted-foreground mb-1">por {book.author}</p>
                          <Badge variant="secondary">{book.category}</Badge>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <p className="text-foreground whitespace-pre-line leading-relaxed">{book.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {books.map((book) => (
                    <Card
                      key={book.id}
                      className="hover:shadow-lg transition-all cursor-pointer bg-white/70"
                      onClick={() => setSelectedBook(book.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mb-2">por {book.author}</p>
                            <Badge variant="outline" className="text-xs">
                              {book.category}
                            </Badge>
                          </div>
                          <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{book.description}</p>
                        <Button className="w-full" size="sm">
                          Ler Agora
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Poems Tab */}
            <TabsContent value="poems" className="flex-1 space-y-4">
              {selectedPoem ? (
                <div className="space-y-4">
                  <Button variant="ghost" onClick={() => setSelectedPoem(null)} className="mb-4 hover:bg-primary/10">
                    ← Voltar aos poemas
                  </Button>
                  {poems
                    .filter((poem) => poem.id === selectedPoem)
                    .map((poem) => (
                      <div key={poem.id} className="space-y-4">
                        <div className="text-center mb-6">
                          <h2 className="text-3xl font-bold text-foreground mb-2">{poem.title}</h2>
                          <p className="text-lg text-muted-foreground">por {poem.author}</p>
                        </div>
                        <div className="bg-white/50 p-8 rounded-lg">
                          <p className="text-foreground whitespace-pre-line leading-relaxed text-center italic">
                            {poem.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {poems.map((poem) => (
                    <Card
                      key={poem.id}
                      className="hover:shadow-lg transition-all cursor-pointer bg-white/70"
                      onClick={() => setSelectedPoem(poem.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{poem.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">por {poem.author}</p>
                          </div>
                          <FileText className="w-8 h-8 text-secondary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground italic line-clamp-3 mb-3">
                          {poem.content.substring(0, 150)}...
                        </p>
                        <Button variant="secondary" className="w-full" size="sm">
                          Ler Poema Completo
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="flex-1 space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Vídeos Educativos</h3>
                <p className="text-muted-foreground">Conteúdo de qualidade sobre bem-estar emocional</p>
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
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videos.map((video) => {
                    const isPlaying = playingVideoId === video.id
                    return (
                      <Card
                        key={video.id}
                        className="hover:shadow-lg transition-all bg-white/70 flex-shrink-0 w-[380px]"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{video.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mb-2">por {video.creator}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {video.duration}
                                </Badge>
                              </div>
                            </div>
                            <Video className="w-8 h-8 text-red-500" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isPlaying ? (
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPlayingVideoId(video.id)}
                              className="aspect-video w-full bg-gray-200 rounded-lg mb-3 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                              aria-label={`Assistir ${video.title}`}
                            >
                              <Play className="w-12 h-12 text-gray-400" />
                            </button>
                          )}
                          <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700"
                            size="sm"
                            onClick={() => setPlayingVideoId(isPlaying ? null : video.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {isPlaying ? "Ocultar Player" : "Assistir Agora"}
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
                  onClick={() => scroll(videosScrollRef, "right")}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </TabsContent>

            {/* Music Tab */}
            <TabsContent value="music" className="flex-1 space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Músicas sobre Bem-estar</h3>
                <p className="text-muted-foreground">Artistas que abordam saúde mental e bem-estar emocional</p>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(musicScrollRef, "left")}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div
                  ref={musicScrollRef}
                  className="flex flex-col gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {music.map((track) => {
                    const isPlaying = playingTrackId === track.id
                    return (
                      <Card key={track.id} className="hover:shadow-lg transition-all bg-white/70 flex-shrink-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Music className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {track.genre}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{track.album}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="flex-shrink-0"
                              onClick={() => setPlayingTrackId(isPlaying ? null : track.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {isPlaying ? "Ocultar" : "Ouvir"}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-3 pl-20">{track.description}</p>
                          {isPlaying && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                              <iframe
                                width="100%"
                                height="80"
                                src={`https://www.youtube.com/embed/${track.youtubeId}?autoplay=1`}
                                title={track.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              ></iframe>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(musicScrollRef, "right")}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </TabsContent>

            {/* Podcasts Tab */}
            <TabsContent value="podcasts" className="flex-1 space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Podcasts sobre Bem-estar</h3>
                <p className="text-muted-foreground">
                  Conversas profundas sobre saúde mental e desenvolvimento pessoal
                </p>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(podcastsScrollRef, "left")}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div
                  ref={podcastsScrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {podcasts.map((podcast) => {
                    const isPlaying = playingPodcastId === podcast.id
                    return (
                      <Card
                        key={podcast.id}
                        className="hover:shadow-lg transition-all bg-white/70 flex-shrink-0 w-[350px]"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{podcast.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mb-2">por {podcast.host}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {podcast.platform}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{podcast.episodes}</span>
                              </div>
                            </div>
                            <Mic className="w-8 h-8 text-purple-500" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{podcast.description}</p>
                          {isPlaying ? (
                            <div className="rounded-lg overflow-hidden mb-2">
                              <iframe
                                src={`https://open.spotify.com/embed/show/${podcast.spotifyShowId}?utm_source=generator&theme=0`}
                                width="100%"
                                height="152"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                              ></iframe>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full bg-transparent"
                              size="sm"
                              onClick={() => setPlayingPodcastId(podcast.id)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Ouvir Agora
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => scroll(podcastsScrollRef, "right")}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <div className="border-t bg-white/50 backdrop-blur-sm p-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Conteúdo selecionado com carinho para seu bem-estar</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
