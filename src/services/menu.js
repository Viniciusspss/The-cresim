import { evoluirHabilidade } from "../aspiracoes"
import { buscarItens, comprarItem } from "../itens"
import { buscaPersonagem } from "../personagem"
import { question } from "../question"

export async function menuComprarItem(personagemId) {
  const itens = await buscarItens()

  console.clear()
  console.log("============== COMPRAR ITEM ==============\n")
  console.log("ID | ITEM (PONTOS)     | VALOR | CATEGORIA\n")
  console.log("------------------------------------------\n")
  for (const item of itens) {
    console.log(`${item.id}. ${item.nome} (${item.pontos}) - R$ ${item.preco} - ${item.categoria}`)
  }
  console.log("==========================================\n")

  let itemSelecionado = null
  do {
    itemSelecionado = parseInt(await question("\nSelecione uma opção para compra:", personagemId));

    if (itemSelecionado < 1 || itemSelecionado > itens.length) {
      console.log("Item inválido.")
    }
  } while (!itemSelecionado || itemSelecionado < 0 || itemSelecionado > itens.length)

  comprarItem(personagemId, itens[itemSelecionado - 1])
}

export async function menuEvoluirHabilidade(personagemId) {
  const personagem = await buscaPersonagem(personagemId)

  console.clear()
  console.log(personagem.itens)
  console.log("=============== MEUS ITENS ===============")
  let index = 1
  for (const item of personagem.itens) {
    console.log(`${index}. ${item.nome} (${item.pontos}) - ${item.categoria}`)
    index++
  }
  console.log("==========================================")
  const itemSelecionado = parseInt(await question("Selecione um item para evoluir habilidade:", personagemId))
  try {
    await evoluirHabilidade(personagemId, personagem.itens[itemSelecionado - 1])
    console.clear()
    console.log(`${personagem.nome} está evoluindo a habilidade...`)
    await new Promise(resolve => setTimeout(resolve, 8000))
    console.clear()
    console.log(`${personagem.nome} evoluiu a habilidade ${personagem.itens[itemSelecionado - 1].categoria.toLowerCase()}!`)
    await question("\nPressione ENTER para continuar...")
    console.clear()
  } catch (error) {
    console.log(error)
  }
}