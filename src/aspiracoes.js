import { atualizaPersonagem, buscaPersonagem } from './personagem.js'

export function defineAspiracao(personagemId, aspiracao) {
  const personagem = buscaPersonagem(personagemId)

  const personagemAtualizado = {
    ...personagem,
    aspiracao,
  }

  atualizaPersonagem(personagemAtualizado)
  return personagemAtualizado
}

export async function evoluirHabilidade(personagemId, item) {
  const personagem = buscaPersonagem(personagemId)

  if (personagem.energia < 4) {
    throw new Error('Energia insuficiente para treinar')
  }

  const habilidadeKey = item.categoria
  personagem.habilidades[habilidadeKey].pontos += item.pontos

  if (habilidadeKey === personagem.aspiracao) {
    personagem.habilidades[habilidadeKey].pontos += 1
  }

  for (const key in personagem.habilidades) {
    const habilidadeAtual = personagem.habilidades[key]

    if (habilidadeAtual.pontos >= 17) {
      habilidadeAtual.nivel = 'PLENO'
    }

    if (habilidadeAtual.pontos > 26) {
      habilidadeAtual.nivel = 'SENIOR'
    }
  }

  personagem.energia -= 4

  atualizaPersonagem(personagem)
  return personagem
}