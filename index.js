import { exibeMenuInicial } from './src/services/mensagens/menus.js'
import { menuCriarPersoangem } from './src/services/menus/menu-inicial.js'

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
        console.log('Não implementado!')
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
