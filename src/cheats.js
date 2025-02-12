import { getDados } from './services/requisicoes/requisicoes'
import { buscaPersonagem, atualizaPersonagem } from './personagem'

export async function aplicaCheat(personagemId, codigo) {
  try {
    const personagem = buscaPersonagem(personagemId)

    const URL = 'https://emilyspecht.github.io/the-cresim/cheats.json'
    const cheats = await getDados(URL)

    const cheat = cheats.find(c => c.codigo === codigo)

    if (!cheat) {
      throw new Error('Cheat inválido')
    }

    if(cheat.codigo === 'SORTENAVIDA') {
      personagem.cresceleons += personagem.cresceleons * (cheat.valor / 100)
    }

    if (cheat.codigo === 'DEITADONAREDE') {
      personagem.energia += cheat.valor
    }

    if (cheat.codigo === 'JUNIM') {
      const aspiracao = personagem.aspiracao
      personagem.habilidades[aspiracao].pontos += cheat.valor
    }

    if (cheat.codigo === 'CAROLINAS') {
      personagem.vida += cheat.valor
    }

    if (cheat.codigo === 'SINUSITE') {
      personagem.vida = cheat.valor
    }

    atualizaPersonagem(personagem)
    return personagem
  } catch (error) {
    return null
  }
}