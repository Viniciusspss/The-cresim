import axios from 'axios'
import { atualizaPersonagem, buscaPersonagem } from './personagem'

export async function buscarItens() {
  const { data } = await axios.get('https://emilyspecht.github.io/the-cresim/itens-habilidades.json')

  const itens = []
  let count = 1
  for(const key in data) {
    for (const item of data[key]) {
      itens.push({...item, id: count, categoria: key})
      count++
    }
  }

  return itens
}

export async function comprarItem(personagemId, item) {
  const personagem = buscaPersonagem(personagemId)

  if (personagem.cresceleons < item.preco) {
    throw new Error('Cresceleons insuficientes')
  }

  const itensExistentes = personagem.itens ?? []

  const personagemAtualizado = {
    ...personagem,
    cresceleons: personagem.cresceleons - item.preco,
    itens: [...itensExistentes, item],
  }

  atualizaPersonagem(personagemAtualizado)
  return personagemAtualizado
}
