import { defineAspiracao, evoluirHabilidade } from "../aspiracoes"
import { buscarItens, comprarItem } from "../itens"
import { buscaPersonagem, buscaPersonagens, criarPersonagem } from "../personagem"
import { question } from "../question"
import { useQuestion } from "./question/use-question"
import { dormir, relacionarPersonagens, tomarBanho, trabalhar } from '../interacoes'
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
  console.clear()
  console.log("====== ESCOLHA UMA ASPIRAÇÃO ======")
  console.log("1. GASTRONOMIA");
  console.log("2. PINTURA");
  console.log("3. JOGOS");
  console.log("4. JARDINAGEM");
  console.log("5. MÚSICA");
  console.log("===================================")

  const aspiracaoSelecionada = parseInt(await question("Selecione a opção: "));

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

export async function exibirPersonagens() {
  let personagens = buscaPersonagens()
  personagens = personagens.filter(personagem => personagem.vida > 0)

  if (personagens.length > 0) {
    console.clear()
    console.log("============== PERSONAGENS ==============")
    personagens.forEach((personagem, i) => {
      console.log(`${i+1}. ${personagem.nome}`)
    });
  console.log("==========================================")
  }else{
    console.log("Você não possui nenhum personagem criado!")
    return null
  }


  try {
    const personagemSelecionado = parseInt(await question("Selecione a opção: "));
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
  console.clear()
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

            break
          }

          case 5: {
            try {
              tomarBanho(personagemSelecionado.id)
              console.log(`${personagemSelecionado.nome} está tomando banho...`)
              await new Promise(resolve => setTimeout(resolve, 3000))
              console.log(`${personagemSelecionado.nome} terminou seu banho!`)

              await useQuestion("\nPressione ENTER para continuar...")
              console.clear()
            } catch (error) {
              console.log(error)
            }

            break
          }

          case 6:
            try {
              await menuRelacionamento(personagemSelecionado.id)
            } catch (error) {
              console.log(error)

              await useQuestion("\nPressione ENTER para continuar...")
              console.clear()
            }
            break;

          default:
            break;
        }

      } catch (error) {
        console.log(error)
      }

      break;

    case 0:
      return true

    default:
      console.log("Opção inválida.");
      break;
  }
}

export async function menuPersonagem(personagemId) {
  //TODO: implementar!
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
    itemSelecionado = parseInt(await question("Selecione uma opção para compra:", personagemId));

    if (itemSelecionado < 1 || itemSelecionado > itens.length) {
      console.log("Item inválido.")
    }
  } while (!itemSelecionado || itemSelecionado < 0 || itemSelecionado > itens.length)

  await comprarItem(personagemId, itens[itemSelecionado - 1])

  console.clear()
  console.log("============== COMPRAR ITEM ==============")
  console.log(`${itens[itemSelecionado].nome} foi comprado com sucesso.`)

  await useQuestion('Pressione ENTER para continuar...')
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
    await useQuestion("\nPressione ENTER para continuar...")
    console.clear()
  } catch (error) {
    console.log(error)
  }
}

export async function exibirInteracoes(personagemSelecionado){
  if(!personagemSelecionado){
    console.log("Nenhum personagem selecionado")
    return null
  }
  console.clear()
  console.log(`Personagem selecionado: ${personagemSelecionado.nome}\n`)
  console.log("============== ATIVIDADES ==============")
  console.log("1. Dormir")
  console.log("2. Trabalhar")
  console.log("3. Comprar item")
  console.log("4. Evoluir habilidade")
  console.log("5. Tomar banho")
  console.log("6. Relacionar")
  console.log("==========================================")

  return parseInt(await question("Selecione a opção: ", personagemSelecionado.id));
}

export async function exibirOpcoesDeRelacionamento(personagemId) {
  console.clear()
  const personagens = buscaPersonagens()
  let contador = 1;  

  const personagensFiltrados = personagens.filter(personagem => personagem.id !== personagemId)
  
  if (!personagensFiltrados.length) {
    throw new Error("Não há personagens pra se relacionar.")
  }

  console.log("============== PERSONAGENS DISPONÍVEIS ==============")
  for (const personagem of personagensFiltrados) {
    console.log(`${contador}. ${personagem.nome}`)
    contador++
  }
  console.log("=====================================================")

  const opcao = parseInt(await question("Selecione um personagem para se relacionar: ", personagemId));

  
  if (opcao < 1 || opcao >= contador) {
    throw new Error('Esse personagem não existe')
  }

  return personagensFiltrados[opcao - 1]
}

export async function exibirMenuDeRelacionamento(personagemId, personagemRelacaoId) {
  console.clear()
  const personagemSelecionado = await buscaPersonagem(personagemId)
  const personagemRelacao = await buscaPersonagem(personagemRelacaoId)

  const pontosRelacionamento = personagemSelecionado.relacionamentos[personagemRelacao.nome].pontos;
  let relacionamentoDescricao = `Relacionamento com ${personagemRelacao.nome}: `;  

  let opcoes = [];

  if (pontosRelacionamento < 0) {
    relacionamentoDescricao += "INIMIZADE 💔\n";    
    opcoes.push("INIMIZADE")
    opcoes.push("NEUTRO");
  } 
  else if(pontosRelacionamento <= 10) {
    relacionamentoDescricao += "NEUTRO 🌱\n";    
    opcoes.push("NEUTRO");
  }
  else if(pontosRelacionamento <= 25) {
    relacionamentoDescricao += "AMIZADE 🍻\n";
    opcoes.push("NEUTRO");
    opcoes.push("AMIZADE");
  }
  else if(pontosRelacionamento > 25) {
    relacionamentoDescricao += "AMOR ❤️‍🔥 \n";
    opcoes.push("NEUTRO");
    opcoes.push("AMIZADE");
    opcoes.push("AMOR");
  }

  console.log(`Personagem: ${personagemSelecionado.nome} | Energia: ${personagemSelecionado.energia} | Vida: ${personagemSelecionado.vida} | Pontos: ${personagemSelecionado.relacionamentos[personagemRelacao.nome].pontos}`)
  console.log(`Personagem: ${personagemRelacao.nome} | Energia: ${personagemRelacao.energia} | Vida: ${personagemRelacao.vida} | Pontos: ${personagemRelacao.relacionamentos[personagemSelecionado.nome].pontos}\n`)
  console.log(relacionamentoDescricao);
  console.log("========== AÇÕES DE RELACIONAMENTO ==========");
  
  opcoes.forEach((opcao, index) => {
    console.log(`${index + 1}. ${opcao}`);
  });
  
  console.log("=============================================");

  let opcao = 0
  do {
    opcao = parseInt(await question("Selecione a opção: ", personagemId));

    if(opcao < 1 || opcao > opcoes.length) {
      console.log("Opção inválida")
    }
  } while(opcao < 1 || opcao > opcoes.length)
  
  return opcoes[opcao - 1];
}

export async function exibirMenuPorNivel(nivelMenu, nomeNivel, personagemId, personagemRelacaoId) {
  const personagem = await buscaPersonagem(personagemId)
  const personagemRelacao = await buscaPersonagem(personagemRelacaoId)

  let opcao = 0
  
  console.clear()
  console.log(`Personagem: ${personagem.nome} | Energia: ${personagem.energia} | Vida: ${personagem.vida} | Pontos: ${personagem.relacionamentos[personagemRelacao.nome].pontos}`)
  console.log(`Personagem: ${personagemRelacao.nome} | Energia: ${personagemRelacao.energia} | Vida: ${personagemRelacao.vida} | Pontos: ${personagemRelacao.relacionamentos[personagem.nome].pontos}\n`)

  do {    
    console.log(`Menu de relacionamento ${nomeNivel}\n`)
    console.log("========== AÇÕES RELACIONAMENTO ==========");
    nivelMenu.forEach((itemMenu) => {
      console.log(`${itemMenu.id}. ${itemMenu.interacao}`)
    })
    console.log("===============================================");

    opcao = parseInt(await question("\nSelecione a opção: ", personagemId));

    if(opcao < 1 || opcao > nivelMenu.length) {
      console.log("\nOpção inválida.")
    }
  } while (opcao < 1 || opcao > nivelMenu.length)

    return nivelMenu[opcao - 1]
}

export async function menuRelacionamento(personagemId) {
  const personagemEscolhido = await exibirOpcoesDeRelacionamento(personagemId)
  
  const opcao = await exibirMenuDeRelacionamento(personagemId, personagemEscolhido.id)
  const urlInteracoes = "https://emilyspecht.github.io/the-cresim/interacoes.json"
  const listaInteracoes = await getDados(urlInteracoes)
  let interacao = 0

  if(opcao === "INIMIZADE") {
    interacao = await exibirMenuPorNivel(listaInteracoes.INIMIZADE, "INIMIZADE 💔", personagemId, personagemEscolhido.id)
  }
  else if(opcao === "NEUTRO") {
    interacao = await exibirMenuPorNivel(listaInteracoes.NEUTRO, "NEUTRO 🌱", personagemId, personagemEscolhido.id)
  }
  else if(opcao === "AMIZADE") {
    interacao = await exibirMenuPorNivel(listaInteracoes.AMIZADE, "AMIZADE 🌱", personagemId, personagemEscolhido.id)
  }
  else {
    interacao = await exibirMenuPorNivel(listaInteracoes.AMOR, "AMOR 🌱", personagemId, personagemEscolhido.id)
  }

  console.clear()

  const energiaFabricyo = interacao.energia  
  const energiaAna = Math.ceil(interacao.energia / 2)
  const vidaPerdida = interacao.energia * 2000;      
  const [personagemPrincipal, personagemInteracao] = await relacionarPersonagens(personagemId, personagemEscolhido.id, interacao)

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
}
