import { exibeMenuInicial, exibirEmpregos, exibirPersonagens, exibirInteracoes } from './src/services/mensagens/menus.js'
import { menuCriarPersoangem } from './src/services/menus/menu-inicial.js'

import { dormir, trabalhar } from './src/interacoes.js';
import { getDados } from './src/services/requisicoes/requisicoes.js';

import { question } from './src/question'
import { menuComprarItem, menuEvoluirHabilidade } from './src/services/menu.js';
import { useQuestion } from './src/services/question/use-question.js';

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
        let personagemSelecionado = await exibirPersonagens()

        if (!personagemSelecionado) {
          break; 
        }

        console.clear()

        const interacaoSelecionada = await exibirInteracoes(personagemSelecionado)

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
