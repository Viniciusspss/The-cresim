import { useQuestion } from './src/services/question/use-question.js';
import { exibeMenuInicial, exibirEmpregos, exibirPersonagens, exibirInteracoes } from './src/services/mensagens/menus.js'
import { menuCriarPersoangem } from './src/services/menus/menu-inicial.js'
import { dormir, trabalhar } from './src/interacoes.js';
import { getDados } from './src/services/requisicoes/requisicoes.js';

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

          case 2:     
            const urlEmprego = "https://emilyspecht.github.io/the-cresim/empregos.json"
            const empregos = await getDados(urlEmprego) 
            const opcaoTrabalho = await exibirEmpregos(personagemSelecionado, empregos)  
            const TEMPO_TRABALHO = 20000           
           
              
            trabalhar(personagemSelecionado, empregos, opcaoTrabalho)
            
            console.log(`\n${personagemSelecionado.nome} esta trabalhando...`)
            await new Promise(resolve => setTimeout(resolve, TEMPO_TRABALHO));
            console.log(`\n${personagemSelecionado.nome} terminou sua jornada de trabalho!`)            
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
