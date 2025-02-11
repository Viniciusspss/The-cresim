import { defineAspiracao, evoluirHabilidade } from "../aspiracoes"
import { buscarItens, comprarItem } from "../itens"
import { buscaPersonagem, buscaPersonagens, criarPersonagem } from "../personagem"
import { question } from "../question"
import { useQuestion } from "./question/use-question"
import { dormir, trabalhar } from '../interacoes'
import { getDados } from "./requisicoes/requisicoes"

export async function menuCriarPersoangem() {
  const nome = await useQuestion("\nQual o nome do personagem? ");
  const personagem = criarPersonagem(nome)

  let aspiracao = null

  do {
    aspiracao = await exibeMenuAspiracoes()
    defineAspiracao(personagem.id, aspiracao)
  } while (aspiracao === null)

  console.clear();
  console.log("\nPersonagem criado!\n");            
  await useQuestion("Pressione ENTER para continuar...")                           
  console.clear(); 
}

export async function exibeMenuAspiracoes() {
  console.log("\nEscolha uma aspiração:");
  console.log("1. GASTRONOMIA");
  console.log("2. PINTURA");
  console.log("3. JOGOS");
  console.log("4. JARDINAGEM");
  console.log("5. MÚSICA");

  const aspiracaoSelecionada = parseInt(await question("\nSelecione a opção: "));

  switch (aspiracaoSelecionada) {
    case 1:
      return 'GASTRONOMIA';

    case 2:
      return  "PINTURA";

    case 3:
     return  "JOGOS";

    case 4:
     return  "JARDINAGEM";

    case 5:
     return  "MÚSICA";

    default:
      console.log("Opção inválida. Escolha um número de 1 a 5.");
      return null
  }
}

const personagens = []
exibirPersonagens(personagens)

export async function exibirPersonagens() {
  let personagens = buscaPersonagens()
  personagens = personagens.filter(personagem => personagem.vida > 0)

  if (personagens.length > 0) {
    console.log("\n============== PERSONAGENS ==============")
    personagens.forEach((personagem, i) => {
      console.log(`${i+1}. ${personagem.nome}`)
    });
  console.log("==========================================")
  }else{
    console.log("Você não possui nenhum personagem criado!")
    return null
  }


  try {
    const personagemSelecionado = parseInt(await question("\nSelecione a opção: "));
    return personagens[personagemSelecionado - 1]
  } catch (error) {
    console.log("\nEsse personagem não existe")
    return null
  }
  
}

export async function exibirEmpregos(personagemSelecionado, empregos) {
  console.clear()
  console.log(`\nPersonagem selecionado: ${personagemSelecionado.nome}`)
  console.log("\n============== EMPREGOS ==============")
  empregos.forEach((emprego, index) => {
    console.log(`${index + 1}. ${emprego.cargo}`)
  })
  console.log("==========================================")

  return parseInt(await question("\nSelecione a opção: ", personagemSelecionado.id));
}

export async function exibeMenuInicial() {
  console.log("============== MENU ==============")
  console.log("1. Criar novo personagem")
  console.log("2. Selecionar personagem")
  console.log("0. Sair do jogo")
  console.log("==================================")

  let opcao = 0
  do {
    opcao = parseInt(await question("Selecione uma opção:"))
  } while (opcao < 0 || opcao > 2)

  switch (opcao) {
    case 1:                
      await menuCriarPersoangem()
      break;

    case 2:
      try {
        let personagemSelecionado = await exibirPersonagens()
        const interacaoSelecionada = await exibirInteracoes(personagemSelecionado)

        console.clear()
        switch (interacaoSelecionada) {
          case 1:
            const tempo = parseInt(await question("\nDigite o tempo que deseja dormir (em segundos): ", personagemSelecionado.id));
            dormir(personagemSelecionado.id, tempo)
            console.log(`${personagemSelecionado.nome} esta dormindo...`)

            await new Promise(resolve => setTimeout(resolve, tempo * 1000));
            console.log(`${personagemSelecionado.nome} acordou!`)

            await useQuestion('\nPressione ENTER para continuar...')
            console.clear()
            break;

          case 2:
            const urlEmprego = "https://emilyspecht.github.io/the-cresim/empregos.json"
            const empregos = await getDados(urlEmprego) 
            const opcaoTrabalho = await exibirEmpregos(personagemSelecionado, empregos)  
            const TEMPO_TRABALHO = 20000           
            
              
            trabalhar(personagemSelecionado.id, empregos, opcaoTrabalho)
            
            console.log(`\n${personagemSelecionado.nome} esta trabalhando...`)
            await new Promise(resolve => setTimeout(resolve, TEMPO_TRABALHO));
            console.log(`\n${personagemSelecionado.nome} terminou sua jornada de trabalho!`)

            await useQuestion("\nPressione ENTER para continuar...")
            console.clear()
            break;

          case 3:
            try {
              await menuComprarItem(personagemSelecionado.id)
            } catch(error) {
              console.log(error)
            }
            break;
        
          case 4: {
            try {
              await menuEvoluirHabilidade(personagemSelecionado.id)
            } catch (error) {
              console.log(error)
            }
          }

          default:
            break;
        }

      } catch (error) {
        console.log(error)
      }

      break;

    case 0:
      return false

    default:
      console.log("Opção inválida.");
      break;
  }
}

export async function menuPersonagem(personagemId) {

}

export async function menuComprarItem(personagemId) {
  const itens = await buscarItens()

  console.clear()
  console.log("============== COMPRAR ITEM ==============")
  console.log("ID | ITEM (PONTOS)     | VALOR | CATEGORIA")
  console.log("------------------------------------------")
  for (const item of itens) {
    console.log(`${item.id}. ${item.nome} (${item.pontos}) - R$ ${item.preco} - ${item.categoria}`)
  }
  console.log("==========================================")

  let itemSelecionado = null
  do {
    itemSelecionado = parseInt(await question("\nSelecione uma opção para compra:", personagemId));

    if (itemSelecionado < 1 || itemSelecionado > itens.length) {
      console.log("Item inválido.")
    }
  } while (!itemSelecionado || itemSelecionado < 0 || itemSelecionado > itens.length)

  await comprarItem(personagemId, itens[itemSelecionado - 1])
}

export async function menuEvoluirHabilidade(personagemId) {
  const personagem = await buscaPersonagem(personagemId)

  console.clear()
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

export async function exibirInteracoes(personagemSelecionado){
  if(!personagemSelecionado){
    console.log("\nNenhum personagem selecionado")
    return null
  }
  console.clear()
  console.log(`\nPersonagem selecionado: ${personagemSelecionado.nome}`)
  console.log("\n============== ATIVIDADES ==============")
  console.log("1. Dormir")
  console.log("2. Trabalhar")
  console.log("3. Comprar item")
  console.log("4. Evoluir habilidade")
  console.log("==========================================")

  return parseInt(await question("\nSelecione a opção: ", personagemSelecionado.id));
}