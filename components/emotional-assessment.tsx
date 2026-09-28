"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, X, Phone, Mail, Heart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Question {
  id: number
  text: string
  options: { value: number; label: string }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "Com que frequência você se sente triste ou deprimido?",
    options: [
      { value: 0, label: "Nunca ou raramente" },
      { value: 1, label: "Às vezes" },
      { value: 2, label: "Frequentemente" },
      { value: 3, label: "Quase sempre ou sempre" },
    ],
  },
  {
    id: 2,
    text: "Você tem dificuldade para dormir ou dorme demais?",
    options: [
      { value: 0, label: "Não, durmo bem" },
      { value: 1, label: "Às vezes tenho dificuldade" },
      { value: 2, label: "Frequentemente tenho problemas" },
      { value: 3, label: "Sempre tenho problemas para dormir" },
    ],
  },
  {
    id: 3,
    text: "Você perdeu o interesse em atividades que antes gostava?",
    options: [
      { value: 0, label: "Não, mantenho meus interesses" },
      { value: 1, label: "Perdi interesse em algumas coisas" },
      { value: 2, label: "Perdi interesse na maioria das coisas" },
      { value: 3, label: "Não tenho interesse em nada" },
    ],
  },
  {
    id: 4,
    text: "Você se sente ansioso ou preocupado com frequência?",
    options: [
      { value: 0, label: "Raramente me sinto ansioso" },
      { value: 1, label: "Às vezes me sinto ansioso" },
      { value: 2, label: "Frequentemente me sinto ansioso" },
      { value: 3, label: "Estou constantemente ansioso" },
    ],
  },
  {
    id: 5,
    text: "Você tem pensamentos sobre se machucar ou sobre morte?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Raramente" },
      { value: 2, label: "Às vezes" },
      { value: 3, label: "Frequentemente" },
    ],
  },
  {
    id: 6,
    text: "Como você avalia sua capacidade de lidar com o estresse diário?",
    options: [
      { value: 0, label: "Lido bem com o estresse" },
      { value: 1, label: "Às vezes tenho dificuldade" },
      { value: 2, label: "Frequentemente me sinto sobrecarregado" },
      { value: 3, label: "Não consigo lidar com o estresse" },
    ],
  },
  {
    id: 7,
    text: "Você se sente isolado ou sozinho?",
    options: [
      { value: 0, label: "Não, tenho bom suporte social" },
      { value: 1, label: "Às vezes me sinto sozinho" },
      { value: 2, label: "Frequentemente me sinto isolado" },
      { value: 3, label: "Sempre me sinto completamente sozinho" },
    ],
  },
]

interface EmotionalAssessmentProps {
  userName: string
  onClose: () => void
}

export function EmotionalAssessment({ userName, onClose }: EmotionalAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const score = calculateScore()
    const maxScore = questions.length * 3

    const isHighRisk = score >= 15 || (answers[5] !== undefined && answers[5] >= 2)

    if (isHighRisk) {
      // Send emergency notification
      try {
        await fetch("/api/emergency-alert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            score,
            maxScore,
            answers,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Error sending emergency alert:", error)
      }
    }

    setIsSubmitting(false)
    setShowResults(true)
  }

  // Nota interna (não mostrada ao utilizador com destaque): usada apenas para
  // decidir qual mensagem de apoio mostrar. Propositadamente não exibimos
  // rótulos como "Risco Alto/Muito Alto" nem pontuações em cores fortes,
  // para não gerar impacto emocional negativo ou desestabilizar quem
  // responde à autoavaliação.
  const getSupportLevel = () => {
    const score = calculateScore()
    const maxScore = questions.length * 3
    const percentage = (score / maxScore) * 100
    const hasHighRiskAnswer = answers[5] !== undefined && answers[5] >= 2

    if (hasHighRiskAnswer || percentage >= 70) return "elevado"
    if (percentage >= 50) return "moderado"
    if (percentage >= 30) return "leve"
    return "estavel"
  }

  const getRecommendation = () => {
    const level = getSupportLevel()

    if (level === "elevado") {
      return {
        title: "Estamos Aqui Consigo",
        description:
          "Obrigado por partilhar isto com sinceridade. Pelo que respondeu, parece que tem estado a passar por um momento particularmente difícil — e isso importa. Não precisa de lidar com isto sozinho(a). Sugerimos que fale com alguém de confiança ou com um profissional em breve; deixámos alguns contactos de apoio abaixo, sempre que sentir necessidade de usar.",
        showEmergencyContacts: true,
      }
    }

    if (level === "moderado") {
      return {
        title: "Recomendamos Apoio Profissional",
        description:
          "Suas respostas sugerem que pode estar a enfrentar desafios emocionais significativos. Recomendamos conversar com um psicólogo através da nossa plataforma ou procurar apoio profissional.",
        showEmergencyContacts: false,
      }
    }

    if (level === "leve") {
      return {
        title: "Considere Apoio Emocional",
        description:
          "Você pode estar a passar por um período difícil. Conversar com o nosso chatbot empático ou participar em grupos de apoio pode ser benéfico.",
        showEmergencyContacts: false,
      }
    }

    return {
      title: "Continue a Cuidar de Si",
      description:
        "Suas respostas indicam que está a lidar bem com as suas emoções neste momento. Continue a praticar o autocuidado e não hesite em procurar apoio se precisar.",
      showEmergencyContacts: false,
    }
  }

  if (showResults) {
    const recommendation = getRecommendation()

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="relative">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl">Obrigado por Partilhar Connosco</CardTitle>
            <CardDescription>Aqui está uma reflexão gentil sobre o que partilhou</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Apresentação intencionalmente calma: sem rótulos de "risco", sem
                cores de alerta fortes nem pontuações numéricas em destaque —
                para acolher a pessoa em vez de a alarmar. */}
            <Alert className="border-primary/20 bg-primary/5">
              <Heart className="h-4 w-4 text-primary" />
              <AlertTitle>{recommendation.title}</AlertTitle>
              <AlertDescription className="mt-2 leading-relaxed">{recommendation.description}</AlertDescription>
            </Alert>

            {recommendation.showEmergencyContacts && (
              <Card className="bg-blue-50/70 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-2 text-base">
                    <Phone className="w-5 h-5" />
                    Contactos de Apoio
                  </CardTitle>
                  <CardDescription className="text-blue-800/80">
                    Disponíveis sempre que precisar — não há problema em pedir ajuda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-900">Emergência Nacional: 112</p>
                    <p className="text-blue-900">SOS Voz Amiga: 213 544 545</p>
                    <p className="text-blue-900">Apoio Emocional Angola: +244 941 983 180</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800/80">
                    <Mail className="w-4 h-4" />
                    <span>apoioemocionalangola@gmail.com</span>
                  </div>
                  <p className="text-xs text-blue-800/70">
                    A nossa equipa foi discretamente notificada e poderá entrar em contacto para lhe oferecer apoio.
                    Se estiver em perigo imediato, ligue já para os serviços de emergência.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Próximos Passos Recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-900">Converse com um psicólogo através da nossa plataforma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-900">Use nosso chatbot empático para apoio emocional imediato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-900">
                      Participe de grupos de apoio com pessoas que passam por situações similares
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-900">Pratique técnicas de relaxamento e meditação guiada</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={onClose} className="flex-1">
                Voltar aos Serviços
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setShowResults(false)
                }}
                className="flex-1 bg-transparent"
              >
                Refazer Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">Autoavaliação Emocional</CardTitle>
          <CardDescription>
            Responda honestamente às perguntas para entender melhor seu estado emocional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold leading-relaxed">{questions[currentQuestion].text}</h3>

            <RadioGroup
              value={answers[questions[currentQuestion].id]?.toString()}
              onValueChange={(value) => handleAnswer(Number.parseInt(value))}
            >
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1 bg-transparent"
            >
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[questions[currentQuestion].id] === undefined || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Processando..." : currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Esta avaliação é apenas uma ferramenta de triagem e não substitui uma avaliação profissional. Todas as
              suas respostas são confidenciais.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
