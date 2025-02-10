import { atualizaPersonagem } from './personagem.js'

export function defineAspiracao(personagem, aspiracao) {
  const personagemAtualizado = {
    ...personagem,
    aspiracao,
    habilidades: {
      'GASTRONOMIA': {
        nivel: 'junior',
        pontos: 0,
      },
      'PINTURA': {
        nivel: 'junior',
        pontos: 0,
      },
      'JOGOS': {
        nivel: 'junior',
        pontos: 0,
      },
      'JARDINAGEM': {
        nivel: 'junior',
        pontos: 0,
      },
      'MUSICA': {
        nivel: 'junior',
        pontos: 0,
      },
    },
  }

  atualizaPersonagem(personagemAtualizado)

  return personagemAtualizado
}

export async function evoluirHabilidade(personagem, habilidade, item) {
  if (personagem.energia < 4) {
    throw new Error('Energia insuficiente para treinar')
  }
  
  const personagemComHabilidadeEvoluida = personagem
  personagemComHabilidadeEvoluida.habilidades[habilidade].pontos += item.pontos

  if (habilidade === personagem.aspiracao) {
    personagemComHabilidadeEvoluida.habilidades[habilidade].pontos += 1
  }

  for (const key in personagemComHabilidadeEvoluida.habilidades) {
    const habilidadeAtual = personagemComHabilidadeEvoluida.habilidades[key]
    if (habilidadeAtual.pontos >= 17) {
      habilidadeAtual.nivel = 'pleno'
    }

    if (habilidadeAtual.pontos > 26) {
      habilidadeAtual.nivel = 'senior'
    }
  }

  personagemComHabilidadeEvoluida.energia -= 4

  atualizaPersonagem(personagemComHabilidadeEvoluida)

  return personagemComHabilidadeEvoluida
}