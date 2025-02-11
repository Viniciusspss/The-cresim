import { useQuestion } from './src/services/question/use-question.js';
import { exibeMenuInicial, exibirEmpregos, exibirPersonagens, exibirInteracoes, exibirOpcoesDeRelacionamento, exibirMenuDeRelacionamento, exibirMenuPorNivel } from './src/services/mensagens/menus.js'
import { menuCriarPersoangem } from './src/services/menus/menu-inicial.js'
import { dormir, relacionarPersonagens, trabalhar } from './src/interacoes.js';
import { getDados } from './src/services/requisicoes/requisicoes.js';
import { buscarItens, comprarItem, listarItens } from './src/itens.js';
import { evoluirHabilidade } from './src/aspiracoes.js';
import { atualizaPersonagem } from './src/personagem.js';


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
            console.log(`${personagemSelecionado.nome} está treinando a habilidade ${itens[itemSelecionado].categoria}...`)
            const habilidadeEvoluida = await evoluirHabilidade(personagemSelecionado, itens[itemSelecionado].categoria, itens[itemSelecionado])

            await new Promise(resolve => setTimeout(resolve, 8000))
            console.log(`${personagemSelecionado.nome} treinou ${itens[itemSelecionado].categoria} por 8 segundos`)
            console.log(`\n====== ${itens[itemSelecionado].categoria} ATUALIZADA ======`)
            console.log(`Nivel: ${habilidadeEvoluida.habilidades[itens[itemSelecionado].categoria].nivel}`)
            console.log(`Pontos: ${habilidadeEvoluida.habilidades[itens[itemSelecionado].categoria].pontos}\n\n`)
            
            await useQuestion("Pressione ENTER para continuar...")
            console.clear()
            break;

          case 4:
            console.clear() 
            const personagemEscolhido = await exibirOpcoesDeRelacionamento(personagemSelecionado)
            console.clear()                     

            const opcao = await exibirMenuDeRelacionamento(personagemSelecionado, personagemEscolhido)
            const urlInteracoes = "https://emilyspecht.github.io/the-cresim/interacoes.json"
            const listaInteracoes = await getDados(urlInteracoes)
            let interacao = 0

            if(opcao === "INIMIZADE") {
              interacao = await exibirMenuPorNivel(listaInteracoes.INIMIZADE, "INIMIZADE 💔", personagemSelecionado, personagemEscolhido)
            }
            else if(opcao === "NEUTRO") {
              interacao = await exibirMenuPorNivel(listaInteracoes.NEUTRO, "NEUTRO 🌱", personagemSelecionado, personagemEscolhido)
            }
            else if(opcao === "AMIZADE") {
              interacao = await exibirMenuPorNivel(listaInteracoes.AMIZADE, "AMIZADE 🌱", personagemSelecionado, personagemEscolhido)
            }
            else {
              interacao = await exibirMenuPorNivel(listaInteracoes.AMOR, "AMOR 🌱", personagemSelecionado, personagemEscolhido)
            }

            console.clear()

            const energiaFabricyo = interacao.energia  
            const energiaAna = Math.ceil(interacao.energia / 2)
            const vidaPerdida = interacao.energia * 2000;      
            const [personagemPrincipal, personagemInteracao] = relacionarPersonagens(personagemSelecionado, personagemEscolhido, interacao)

            console.log(`${personagemPrincipal.nome} fez a ação de '${interacao.interacao}' com ${personagemInteracao.nome}\n`);
            console.log(`${personagemPrincipal.nome}:`);
            console.log(`   Energia perdida: ${energiaFabricyo}`);
            console.log(`   Vida perdida: ${vidaPerdida}`);
            console.log(`   Pontos acumulados: ${interacao.pontos}\n\n`);
            
            console.log(`${personagemInteracao.nome}:`);
            console.log(`   Energia perdida: ${energiaAna}`);
            console.log(`   Vida perdida: ${vidaPerdida}`);
            console.log(`   Pontos acumulados: ${interacao.pontos}\n`);       

            await useQuestion("\nPressione ENTER para continuar...")
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
