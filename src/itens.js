import axios from 'axios'
import { atualizaPersonagem } from './personagem'

export async function buscarItens() {
  const { data } = await axios.get('https://emilyspecht.github.io/the-cresim/itens-habilidades.json')
  return data
}

export async function comprarItem(personagem, item) {
  if (personagem.cresceleons < item.preco) {
    throw new Error('Você não tem dinheiro suficiente para comprar este item')
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

export async function listarItems() {
  const items = await buscarItens()

  console.clear()
  console.log('===================================\n')
  console.log('Itens disponíveis para compra:\n')
  console.log('===================================\n')
  for(const item of items) {
    console.log(`${item.id} | ${item.nome} | Pontos: ${item.pontos} | Preço: ${item.preco}\n`)
    console.log('-----------------------------------\n')
  }

  return items
}
