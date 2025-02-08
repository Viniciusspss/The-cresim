import { atualizaPersonagem } from './personagem'

export function defineAspiracao(personagem, aspiracao) {
  const personagemAtualizado = {
    ...personagem,
    aspiracao,
  }

  atualizaPersonagem(personagemAtualizado)

  return personagemAtualizado
}