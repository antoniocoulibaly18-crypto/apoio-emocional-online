import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Shield, Globe } from "lucide-react"

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Uma ponte entre a dor e a esperança
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            A falta de apoio emocional é um risco silencioso. E esse risco cresce num país com poucos psicólogos, acesso
            limitado a cuidados especializados, estigma social e sem nenhuma plataforma online de apoio psicológico
            acessível, gratuita e contínua.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Por que este projeto é importante?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Poucos profissionais</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Angola tem um número limitado de psicólogos para atender toda a população.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Estigma social</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Muitas pessoas sofrem em silêncio devido ao estigma associado à saúde mental.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Falta de plataformas</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Não existe uma plataforma online acessível e gratuita para apoio psicológico.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary animate-soft-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">A nossa missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Criar um espaço digital, humano e acolhedor onde qualquer pessoa, em qualquer parte do país, possa ser
                  ouvida, acolhida e respeitada — sem julgamento, sem rótulos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-4 text-balance italic">
            "Este não é apenas um projeto. É uma ponte entre a dor e a esperança."
          </blockquote>
          <p className="text-lg text-muted-foreground text-pretty">
            Se queremos um país mais saudável, mais forte, mais justo — precisamos cuidar da saúde mental do nosso povo.
          </p>
        </div>
      </div>
    </section>
  )
}
