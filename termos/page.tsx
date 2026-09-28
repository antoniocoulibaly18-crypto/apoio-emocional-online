import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Termos de Uso e Política de Privacidade | Apoio Emocional Angola",
  description: "Termos de Uso e Política de Privacidade da plataforma Apoio Emocional Angola.",
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Apoio Emocional Angola</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Termos de Uso e Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">Última atualização: 25 de julho de 2026</p>
        </div>

        <div className="mb-10 p-5 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-900 leading-relaxed">
          Este não é um serviço de emergência. Se está em perigo imediato ou a pensar em fazer mal a si mesmo(a),
          ligue já para o <strong>112</strong> (Emergência Nacional), para o <strong>SOS Voz Amiga (213 544 545)</strong>{" "}
          ou dirija-se ao serviço de urgência mais próximo.
        </div>

        {/* ============ TERMOS DE USO ============ */}
        <section id="uso" className="space-y-8 scroll-mt-24">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">1. Termos de Uso</h2>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1.1 Sobre a Plataforma</h3>
            <p className="text-muted-foreground leading-relaxed">
              A Apoio Emocional Angola ("nós", "a Plataforma") é um espaço digital de apoio emocional que
              disponibiliza autoavaliações, conteúdos de bem-estar, exercícios de relaxamento, um chatbot empático e
              acesso a psicólogos parceiros. A Plataforma não presta cuidados médicos ou psiquiátricos de emergência
              e não substitui o acompanhamento por um profissional de saúde mental qualificado.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1.2 Elegibilidade e Idade Mínima</h3>
            <p className="text-muted-foreground leading-relaxed">
              O registo e a utilização autónoma da Plataforma destinam-se a pessoas com <strong>18 anos ou mais</strong>.
              Menores de idade só podem utilizar a Plataforma com o conhecimento e consentimento expresso de um dos
              pais ou de um responsável legal, e idealmente com o seu acompanhamento direto durante a utilização.
              Reservamo-nos o direito de solicitar comprovativo de idade ou de consentimento parental e de suspender
              contas quando existam dúvidas razoáveis quanto ao cumprimento deste requisito.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1.3 Natureza dos Serviços</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                A <strong>Autoavaliação Emocional</strong> é uma ferramenta de triagem informativa, não um diagnóstico
                clínico. Os resultados não substituem uma avaliação feita por um profissional de saúde mental.
              </li>
              <li>
                O <strong>chatbot empático</strong> é um recurso de apoio conversacional e não é um psicólogo, médico
                ou terapeuta. Não deve ser usado como única fonte de apoio em situações de crise.
              </li>
              <li>
                As sessões com <strong>psicólogos parceiros</strong> são prestadas por profissionais independentes,
                responsáveis pela sua própria conduta ética e profissional perante as entidades reguladoras
                competentes.
              </li>
              <li>
                A <strong>Biblioteca de Bem-estar</strong> e os conteúdos de <strong>Relaxamento Guiado</strong>{" "}
                podem incluir ligações para vídeos, músicas, podcasts e outros materiais alojados em plataformas de
                terceiros (como YouTube, Spotify ou Apple Podcasts). Não somos responsáveis pelo conteúdo, pela
                disponibilidade ou pelas políticas de privacidade dessas plataformas externas.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1.4 Conduta do Utilizador</h3>
            <p className="text-muted-foreground leading-relaxed">
              Compromete-se a utilizar a Plataforma de forma respeitosa, a não partilhar conteúdo ofensivo, ilegal ou
              que coloque terceiros em risco, e a fornecer informação verdadeira no registo e nas avaliações. Em
              situações que indiquem risco iminente para a sua vida ou a de terceiros, poderemos partilhar
              informação estritamente necessária com serviços de emergência ou com profissionais de saúde, conforme
              descrito na secção 2.5.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1.5 Limitação de Responsabilidade</h3>
            <p className="text-muted-foreground leading-relaxed">
              A Plataforma é disponibilizada "tal como está". Fazemos o possível para manter os serviços disponíveis
              e precisos, mas não garantimos que estejam livres de interrupções ou erros. O uso da Plataforma é da
              responsabilidade do utilizador, e em situações de emergência deve recorrer sempre aos serviços de
              saúde ou de emergência competentes.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">1.6 Alterações aos Termos</h3>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar estes Termos periodicamente. Alterações significativas serão comunicadas através da
              Plataforma. A utilização continuada após uma alteração implica a aceitação dos novos Termos.
            </p>
          </div>
        </section>

        {/* ============ POLÍTICA DE PRIVACIDADE ============ */}
        <section id="privacidade" className="space-y-8 mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">2. Política de Privacidade</h2>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.1 Dados que Recolhemos</h3>
            <p className="text-muted-foreground leading-relaxed">
              Podemos recolher dados de registo (nome, contacto), respostas às autoavaliações emocionais, mensagens
              trocadas com o chatbot e com psicólogos, e dados técnicos básicos de utilização. Tratamos dados
              relativos à saúde mental com especial cuidado, apenas para os fins descritos nesta política.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.2 Finalidade do Tratamento</h3>
            <p className="text-muted-foreground leading-relaxed">
              Usamos os seus dados para prestar os serviços solicitados, personalizar recomendações de bem-estar,
              permitir o contacto com psicólogos, melhorar a Plataforma e, quando aplicável, para acionar apoio em
              situações de risco identificadas numa autoavaliação.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.3 Confidencialidade e Partilha de Dados</h3>
            <p className="text-muted-foreground leading-relaxed">
              As suas respostas e conversas são tratadas com confidencialidade. Não vendemos os seus dados pessoais.
              Podemos partilhar informação limitada com psicólogos parceiros (para efeitos do acompanhamento
              solicitado) e, excecionalmente, com serviços de emergência ou autoridades competentes quando exista
              risco sério e iminente para a vida ou segurança do utilizador ou de terceiros.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.4 Segurança e Retenção</h3>
            <p className="text-muted-foreground leading-relaxed">
              Aplicamos medidas técnicas e organizativas razoáveis para proteger os seus dados contra acesso não
              autorizado, perda ou alteração. Conservamos os dados apenas pelo tempo necessário às finalidades
              descritas nesta política ou enquanto a lei o exigir.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.5 Situações de Risco</h3>
            <p className="text-muted-foreground leading-relaxed">
              Quando uma autoavaliação ou conversa indicar sinais de risco elevado para a segurança do utilizador,
              a nossa equipa pode ser notificada internamente para poder oferecer apoio adicional. Esta notificação
              destina-se exclusivamente a proteger o bem-estar do utilizador e não é usada para qualquer outro fim.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.6 Menores de Idade</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Não recolhemos intencionalmente dados de menores de 13 anos. Se tomarmos conhecimento de que foram
                recolhidos dados de uma criança nessa faixa etária sem consentimento parental válido, eliminá-los-emos
                assim que possível.
              </li>
              <li>
                Para utilizadores entre os 13 e os 17 anos, a utilização da Plataforma requer consentimento de um
                dos pais ou responsável legal. Os pais ou responsáveis podem, a qualquer momento, solicitar acesso,
                correção ou eliminação dos dados do menor, contactando-nos através dos canais indicados na secção
                2.8.
              </li>
              <li>
                Procuramos que o conteúdo apresentado a menores identificados como tal seja adequado à idade,
                evitando conteúdos ou recomendações destinados exclusivamente a adultos.
              </li>
              <li>
                Em caso de sinais de risco grave envolvendo um menor (por exemplo, indicação de perigo para a sua
                vida ou segurança), poderemos, sempre que necessário e proporcional, informar um responsável legal
                ou as autoridades competentes, para garantir a proteção da criança ou adolescente.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.7 Os Seus Direitos</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pode solicitar, a qualquer momento, o acesso, a retificação ou a eliminação dos seus dados pessoais,
              bem como retirar o seu consentimento para o tratamento de dados, sem que isso comprometa a
              licitude do tratamento realizado anteriormente.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">2.8 Contacto</h3>
            <p className="text-muted-foreground leading-relaxed">
              Para questões sobre estes Termos, sobre a Política de Privacidade, ou para exercer os seus direitos
              (ou os direitos de um menor a seu cargo), contacte-nos através de{" "}
              <a href="mailto:apoioemocionalangola@gmail.com" className="text-primary underline">
                apoioemocionalangola@gmail.com
              </a>{" "}
              ou pelo telefone +244 941 983 180.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
