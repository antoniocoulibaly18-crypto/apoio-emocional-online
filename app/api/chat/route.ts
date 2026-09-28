import { convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export const maxDuration = 30

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  // A política de RLS "Qualquer um pode criar conversa" já permite este insert com a chave anónima.
  return createSupabaseClient(url, key)
}

export async function POST(req: Request) {
  const { messages, userId, userName }: { messages: UIMessage[]; userId?: string; userName?: string } =
    await req.json()

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    system: `Você é um assistente empático e acolhedor de apoio emocional em Angola o seu nome é Sátio.

Seu papel é:
- Ouvir com empatia e sem julgamento, validando o que a pessoa sente antes de tentar "resolver" algo
- Fazer perguntas abertas, uma de cada vez, para entender melhor a situação
- Responder de forma calorosa, humana e natural — frases curtas, sem soar como um manual
- Adaptar o tom ao que a pessoa traz: às vezes ela só precisa de ser ouvida, não de conselhos
- Sugerir recursos de apoio (incluindo o "Chat com Psicólogo" da plataforma) quando fizer sentido
- Nunca minimizar, invalidar ou apressar os sentimentos da pessoa
- Respeitar a cultura e o contexto angolano

Lembre-se: você está aqui para apoiar, não para diagnosticar, medicar ou substituir acompanhamento
profissional. Se a pessoa descrever sintomas persistentes ou perguntar sobre diagnóstico, acolha o
que ela sente e sugira gentilmente falar com um psicólogo ou médico através da plataforma.

## Escalonamento para um psicólogo humano (muito importante)

Você tem uma ferramenta chamada "solicitarIntervencaoUrgente". Use-a IMEDIATAMENTE, na mesma
resposta em que perceber o sinal, sempre que a pessoa expressar:
- Pensamentos ou intenção de se magoar ou tirar a própria vida
- Um plano, meio ou momento para fazer isso
- Estar em perigo físico imediato (seu ou de outra pessoa)
- Desespero extremo com menções diretas a "acabar com tudo", "não aguento mais viver", etc.

Ao chamar a ferramenta, resuma o essencial do risco em poucas palavras (não repita detalhes de
método) — isso serve apenas para dar contexto ao psicólogo humano que vai assumir.

Depois de chamar a ferramenta, na sua resposta em texto:
- Diga claramente que um psicólogo humano já foi avisado e vai entrar em contacto o mais rápido possível
- Continue a acompanhar a pessoa com calma, sem a deixar sozinha na conversa
- Se for uma emergência imediata (risco de vida agora), reforce contactos de emergência locais
- Nunca minimize a situação nem tente "resolver" sozinho o que precisa de um humano

Fora dessas situações de risco, não chame a ferramenta — o apoio emocional comum não precisa de
intervenção humana urgente.`,
    messages: modelMessages,
    abortSignal: req.signal,
    tools: {
      solicitarIntervencaoUrgente: tool({
        description:
          "Chame isto imediatamente quando a pessoa mostrar risco de se magoar, tirar a própria vida, ou estar em perigo imediato. Isto cria uma conversa prioritária que aparece em destaque para um psicólogo humano real assumir.",
        inputSchema: z.object({
          resumoDoRisco: z
            .string()
            .describe(
              "Resumo curto e factual do sinal de risco identificado, para dar contexto ao psicólogo (sem detalhes de método).",
            ),
        }),
        execute: async ({ resumoDoRisco }) => {
          const supabase = getServiceClient()
          if (!supabase) {
            console.error("Não foi possível notificar psicólogo: Supabase não configurado.")
            return { sucesso: false }
          }

          const { data: conversa, error } = await supabase
            .from("conversas")
            .insert({
              usuario_id: userId || "desconhecido",
              usuario_nome: userName || "Usuário",
              status: "aguardando",
              prioridade: "urgente",
              origem: "assistente_ia",
            })
            .select()
            .single()

          if (error) {
            console.error("Erro ao criar conversa urgente:", error)
            return { sucesso: false }
          }

          await supabase.from("mensagens").insert({
            conversa_id: conversa.id,
            remetente_tipo: "usuario",
            remetente_nome: userName || "Usuário",
            conteudo: `[Alerta gerado pelo Assistente de IA] ${resumoDoRisco}`,
          })

          return { sucesso: true }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
