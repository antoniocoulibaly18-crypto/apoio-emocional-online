import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section id="inicio" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="mb-8 animate-gentle-float">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary animate-soft-pulse" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
          Um espaço seguro para o seu <span className="text-primary">bem-estar emocional</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
          Centro de Apoio Emocional e Prevenção ao Suicídio em Angola. Um lugar onde pode ser ouvido, acolhido e
          respeitado — sem julgamento, sem rótulos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
            <MessageCircle className="w-5 h-5 mr-2" />
            Conversar Agora
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
            <Shield className="w-5 h-5 mr-2" />
            Saiba Mais
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Conversas Anônimas</h3>
            <p className="text-muted-foreground text-sm">Fale com psicólogos voluntários formados em total anonimato</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Apoio 24h</h3>
            <p className="text-muted-foreground text-sm">Chatbot empático disponível a qualquer hora do dia ou noite</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Ambiente Seguro</h3>
            <p className="text-muted-foreground text-sm">
              Espaço protegido e confidencial para partilhar os seus sentimentos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
