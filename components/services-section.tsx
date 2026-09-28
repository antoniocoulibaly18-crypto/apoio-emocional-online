import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Bot, Users, ClipboardList, UserCheck, Heart } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: MessageCircle,
      title: "Conversas com Psicólogos",
      description: "Fale anonimamente com psicólogos voluntários formados e experientes.",
      features: ["Conversas anônimas", "Profissionais qualificados", "Sem custos"],
    },
    {
      icon: Bot,
      title: "Chatbot Empático 24h",
      description: "Desabafe a qualquer hora com nosso chatbot sensível e compreensivo.",
      features: ["Disponível 24/7", "Respostas empáticas", "Suporte imediato"],
    },
    {
      icon: Users,
      title: "Sessões de Grupo",
      description: "Participe de sessões de escuta, partilha e exercícios de relaxamento.",
      features: ["Exercícios de respiração", "Meditação guiada", "Partilha de experiências"],
    },
    {
      icon: ClipboardList,
      title: "Autoavaliação Emocional",
      description: "Questionários semanais para monitorizar o seu bem-estar emocional.",
      features: ["Questionários personalizados", "Alertas de risco", "Acompanhamento contínuo"],
    },
    {
      icon: UserCheck,
      title: "Encaminhamento Profissional",
      description: "Receba encaminhamento gratuito para estudantes e profissionais da psicologia.",
      features: ["Rede de profissionais", "Encaminhamento gratuito", "Acompanhamento especializado"],
    },
    {
      icon: Heart,
      title: "Apoio Contínuo",
      description: "Acompanhamento personalizado e suporte emocional contínuo.",
      features: ["Plano personalizado", "Suporte a longo prazo", "Cuidado individualizado"],
    },
  ]

  return (
    <section id="servicos" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Os nossos serviços</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Uma gama completa de serviços de apoio emocional, disponíveis gratuitamente para todos os angolanos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300 border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  Saber Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
