import { useQuestion } from './src/services/question/use-question.js';
import { exibeMenuInicial } from './src/services/mensagens/menus.js'
import { menuCriarPersoangem } from './src/services/menus/menu-inicial.js'
import { exibirPersonagens, exibirInteracoes } from './src/services/mensagens/menus.js';
import { dormir } from './src/interacoes.js';

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

    console.log("FIM DE JOGO");        
  }
}

main()
