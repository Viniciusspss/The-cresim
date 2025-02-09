import { atualizaPersonagem } from './personagem.js'

export function defineAspiracao(personagem, aspiracao) {
  const personagemAtualizado = {
    ...personagem,
    aspiracao,
  }

  atualizaPersonagem(personagemAtualizado)

  return personagemAtualizado
}