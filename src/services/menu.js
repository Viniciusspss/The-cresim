import { evoluirHabilidade } from "../aspiracoes"
import { buscarItens, comprarItem } from "../itens"
import { buscaPersonagem } from "../personagem"
import { question } from "../question"

export async function exibeMenuInicial() {
  console.log("============== MENU ==============")
  console.log("1. Criar novo personagem")
  console.log("2. Selecionar personagem")
  console.log("0. Sair do jogo")
  console.log("==================================")

  let opcao = 0
  while (!finalizarJogo) {
    do {
      opcao = await exibeMenuInicial()
    } while (opcao < 0 || opcao > 2)

    switch (opcao) {
      case 1:                
        await menuCriarPersoangem()
        break;

      case 2:
        // let personagemSelecionado = await exibirPersonagens()

        // if (!personagemSelecionado) {
        //   break; 
        // }

        // console.clear()

        // const interacaoSelecionada = await exibirInteracoes(personagemSelecionado)

        // switch (interacaoSelecionada) {
        //   case 1:
        //     const tempo = parseInt(await question("\nDigite o tempo que deseja dormir (em segundos): ", personagemSelecionado.id));
        //     dormir(personagemSelecionado.id, tempo)
        //     console.log(`${personagemSelecionado.nome} esta dormindo...`)

        //     await new Promise(resolve => setTimeout(resolve, tempo * 1000));
        //     console.log(`${personagemSelecionado.nome} acordou!`)

        //     await useQuestion('\nPressione ENTER para continuar...')
        //     console.clear()
        //     break;

        //   case 2:     
        //     const urlEmprego = "https://emilyspecht.github.io/the-cresim/empregos.json"
        //     const empregos = await getDados(urlEmprego) 
        //     const opcaoTrabalho = await exibirEmpregos(personagemSelecionado, empregos)  
        //     const TEMPO_TRABALHO = 20000           
           
              
        //     trabalhar(personagemSelecionado.id, empregos, opcaoTrabalho)
            
        //     console.log(`\n${personagemSelecionado.nome} esta trabalhando...`)
        //     await new Promise(resolve => setTimeout(resolve, TEMPO_TRABALHO));
        //     console.log(`\n${personagemSelecionado.nome} terminou sua jornada de trabalho!`) 
        //     break;      

        //   case 3:
        //     try {
        //       await menuComprarItem(personagemSelecionado.id)
        //     } catch(error) {
        //       console.log(error)
        //     }
        //     break;
        
        //   case 4: {
        //     try {
        //       await menuEvoluirHabilidade(personagemSelecionado.id)
        //     } catch (error) {
        //       console.log(error)
        //     }
        //   }
        //   default:
        //     break;
        // }
        // break;

      case 0:
        return false
        break;

      default:
        console.log("Opção inválida.");
        break;
    }
  }
}

export async function menuPersonagem(personagemId) {

}


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

