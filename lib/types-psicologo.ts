export interface Psicologo {
  id: string
  nome: string
  crp: string
  especialidade: string | null
  bio: string | null
  foto_url: string | null
  ativo: boolean
  online: boolean
  criado_em: string
}

export interface Conversa {
  id: string
  usuario_id: string
  usuario_nome: string
  psicologo_id: string | null
  status: "aguardando" | "em_andamento" | "encerrada"
  prioridade: "normal" | "urgente"
  origem: "chat_direto" | "assistente_ia"
  criado_em: string
  atualizado_em: string
}

export interface Mensagem {
  id: string
  conversa_id: string
  remetente_tipo: "usuario" | "psicologo"
  remetente_nome: string
  conteudo: string
  criado_em: string
}
