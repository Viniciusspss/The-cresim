import axios from 'axios'
import { atualizaPersonagem } from './personagem'

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

export async function comprarItem(personagem, item) {
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

export async function listarItens() {
  const items = await buscarItens()

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = []
    }

    acc[item.categoria].push(item)

    return acc
  }, {})

  console.clear()
  console.log("\n========== ITENS DINSPONÍVEIS ==========")
  console.log('\nOpção | Nome do item (Pontos) | Preço')
  console.log("\n============== ATIVIDADES ==============")
  for (const key in grouped) {
    console.log(`\n${key.toUpperCase()}`)
    for (const item of grouped[key]) {
      console.log(`\n${item.id}. ${item.nome} (${item.pontos}) - R$ ${item.preco}`)
    }
  }

  return items
}
