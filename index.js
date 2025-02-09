import { useQuestion } from './src/services/question/use-question.js';
import { exibeMenuInicial } from './src/services/mensagens/menus.js'
import { menuCriarPersoangem } from './src/services/menus/menu-inicial.js'
import { exibirPersonagens, exibirInteracoes } from './src/services/mensagens/menus.js';
import { dormir } from './src/interacoes.js';
import { buscarItens, comprarItem, listarItens } from './src/itens.js';
import { evoluirHabilidade } from './src/aspiracoes.js';

const main = async () => {
  let opcao = 0;
  let finalizarJogo = false 

  while (!finalizarJogo) {
    do {
      opcao = await exibeMenuInicial()
    } while (opcao < 0 || opcao > 2)

    switch (opcao) {
      case 1:                
        await menuCriarPersoangem()
        break;

      case 2:
        let personagemSelecionado = null

        do{
          personagemSelecionado = await exibirPersonagens()
        }while (!personagemSelecionado)
        console.clear()

        const interacaoSelecionada = await exibirInteracoes(personagemSelecionado)

        switch (interacaoSelecionada) {
          case 1:
            const tempo = parseInt(await useQuestion("\nDigite o tempo que deseja dormir (em segundos): "));
            dormir(personagemSelecionado,tempo)
            console.log(`${personagemSelecionado.nome} esta dormindo...`)

            await new Promise(resolve => setTimeout(resolve, tempo * 1000));
            console.log(`${personagemSelecionado.nome} acordou!`)
            
            break;

          case 3:
            const itens = await buscarItens()
            let itemSelecionado = null

            do {
              await listarItens(itens)
              itemSelecionado = parseInt(await useQuestion("Digite o número do item que deseja comprar: "))

              if (itemSelecionado < 1 || itemSelecionado > itens.length) {
                console.log("Item inválido.")
              }
            } while (!itemSelecionado || itemSelecionado < 0 || itemSelecionado > itens.length)

            comprarItem(personagemSelecionado, itens[itemSelecionado - 1])
            console.log("Item comprado com sucesso!")

            console.clear()
            console.log(`${personagem.nome} está treinando a habilidade ${habilidade}...`)
            await evoluirHabilidade(personagemSelecionado, itens[itemSelecionado].categoria, itens[itemSelecionado])

            await new Promise(resolve => setTimeout(resolve, 8000))
            console.log(`${personagem.nome} treinou ${habilidade} por 8 segundos`)
            console.log(`\n====== ${habilidade} ATUALIZADA ======`)
            console.log(`Nivel: ${personagem.habilidades[habilidade].nivel}`)
            console.log(`Pontos: ${personagem.habilidades[habilidade].pontos}\n\n`)
            
            await useQuestion("Pressione ENTER para continuar...")
            console.clear()
            break;
        
          default:
            break;
        }
        break;

      case 0:
        finalizarJogo = true;              
        console.clear();              
        break;

      default:
        console.log("Opção inválida.");
        break;
    }
  }

  console.log("\nFIM DE JOGO");   
}

main()
