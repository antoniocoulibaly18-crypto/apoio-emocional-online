import { Heart, Mail, Phone, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-xl font-semibold">Apoio Emocional Angola</span>
            </div>
            <p className="text-background/80 leading-relaxed mb-4">
              Um espaço digital, humano e acolhedor para apoio emocional em Angola. Estamos aqui para ouvir, acolher e
              apoiar — sem julgamento, sem rótulos.
            </p>
            <p className="text-sm text-background/60">Uma ponte entre a dor e a esperança.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="text-background/80 hover:text-background transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-background/80 hover:text-background transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-background/80 hover:text-background transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-background/80 hover:text-background transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-background/60" />
                <span className="text-background/80">apoioemocionalangola@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-background/60" />
                <span className="text-background/80">+244 941 983 180</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-background/60" />
                <span className="text-background/80">Chat 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">© 2025 Apoio Emocional Angola. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-sm">
              <a href="/termos#privacidade" className="text-background/60 hover:text-background transition-colors">
                Política de Privacidade
              </a>
              <a href="/termos#uso" className="text-background/60 hover:text-background transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Ajuda
              </a>
              <a href="/psicologo/login" className="text-background/60 hover:text-background transition-colors">
                É psicólogo? Entre aqui
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
