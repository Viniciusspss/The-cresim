import { getDados } from "./services/requisicoes/requisicoes"
import { useQuestion } from "./services/question/use-question"
import { defineAspiracao, evoluirHabilidade } from "./habilidade"
import { buscarItens, comprarItem } from "./itens"
import { buscaPersonagem, buscaPersonagens, criarPersonagem } from "./personagem"
import { dormir } from './dormir'
import { relacionarPersonagens } from './relacionamento'
import { tomarBanho } from "./banho"
import { trabalhar } from "./trabalho"
import { aplicaCheat } from "./cheats"

// MENU PRINCIPAL
export async function exibeMenuInicial() {
  console.clear()
  console.log("============== MENU ==============")
  console.log("1. Criar novo personagem")
  console.log("2. Selecionar personagem")
  console.log("----------------------------------")
  console.log("0. Sair do jogo")
  console.log("==================================")

  let opcao = 0
  let menuPersonagemAtivo = true
  
  do {
    opcao = parseInt(await question("Selecione uma opção:"))
  } while (opcao < 0 || opcao > 2)

  switch (opcao) {
    case 1:                
      await menuCriarPersoangem()
      break;

    case 2:
      while(menuPersonagemAtivo) {
        let interagindo = true

        const personagemSelecionado = await exibirPersonagens()
        
        if (personagemSelecionado === null) {
          menuPersonagemAtivo = false
          continue
        }
        
        do {
          interagindo = await exibirInteracoes(personagemSelecionado.id)
        } while (interagindo)
      }
      break;

    case 0:
      return true

    default:
      console.log("Opção inválida.");
      break;
  }
}

// MENU DO PERSONAGEM
export async function exibirInteracoes(personagemId){
  const personagem = buscaPersonagem(personagemId)

  console.clear()
  exibirPersonagemSelecionado(personagem.id)
  console.log("============ ATIVIDADES ============")
  console.log("1. Dormir")
  console.log("2. Trabalhar")
  console.log("3. Comprar item")
  console.log("4. Evoluir habilidade")
  console.log("5. Tomar banho")
  console.log("6. Relacionar")
  console.log("-----------------------------------")
  console.log("0. Voltar para lista de personagens")
  console.log("===================================")

  let opcao = 0
  do {
    opcao = parseInt(await question("Selecione a opção: ", personagemId))
  } while (opcao < 0 || opcao > 6)

  switch (opcao) {
    case 1:
      await menuDormir(personagemId)
      break;

    case 2:
      await menuTrabalhar(personagemId)
      break;

    case 3:
      await menuComprarItem(personagemId)
      break;
  
    case 4: {
      await menuEvoluirHabilidade(personagemId)
      break;
    }

    case 5: {
      await menuTomarBanho(personagemId)
      break;
    }

    case 6:
      await menuRelacionamento(personagemId)
      break;

    case 0:
      return false

    default:
      console.log("Opção inválida.");
      break
  }

  return true
}

// TELA CRIAR PERSONAGEM
export async function menuCriarPersoangem() {
  console.clear()
  console.log("============== CRIAR PERSONAGEM ==============")
  console.log("Crie um novo personagem para começar a jogar!")
  console.log("==============================================")
  const nome = await useQuestion("\nQual o nome do personagem? ");
  const personagem = criarPersonagem(nome)

  let aspiracao = null

  do {
    aspiracao = await exibeMenuAspiracoes()
    defineAspiracao(personagem.id, aspiracao)
  } while (aspiracao === null)

  console.clear();
  console.log("============== CRIAR PERSONAGEM ==============")
  console.log("Personagem criado!")   
  console.log("==============================================")
  
  await mensagemContinue()
}

export async function exibeMenuAspiracoes() {
  console.clear()
  console.log("=========== ESCOLHA UMA HABILIDADE ===========")
  console.log("Escolha uma habilidade para o seu personagem:")
  console.log("==============================================")
  console.log("1. GASTRONOMIA");
  console.log("2. PINTURA");
  console.log("3. JOGOS");
  console.log("4. JARDINAGEM");
  console.log("5. MÚSICA");
  console.log("==============================================")

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

// PERSONAGEM
export async function exibirPersonagens() {
  try {
    let personagens = buscaPersonagens()
    personagens = personagens.filter(personagem => personagem.vida > 0)

    if (personagens.length > 0) {
      console.clear()
      console.log("============== PERSONAGENS ==============")
      personagens.forEach((personagem, i) => {
        console.log(`${i+1}. ${personagem.nome}`)
      });
      console.log("-----------------------------------------")
      console.log("0. voltar para menu principal")
      console.log("=========================================")
    }else{
      console.log("Você não possui nenhum personagem criado!")
      return null
    }

    let personagemSelecionado = null
    do {
      personagemSelecionado = parseInt(await useQuestion("Selecione a opção: "))
      if (personagemSelecionado === 0) {
        return null
      }
    } while(personagemSelecionado < 1 || personagemSelecionado > personagens.length)

    return personagens[personagemSelecionado - 1]
  } catch (error) {
    console.log(error.message)
    await mensagemContinue()
  }
}

// TRABALHO
export async function exibirEmpregos(personagemSelecionado, empregos) {
  console.clear()
  exibirPersonagemSelecionado(personagemSelecionado.id)
  console.log("=============== EMPREGOS ===============")
  empregos.forEach((emprego, index) => {
    console.log(`${index + 1}. ${emprego.cargo}`)
  })
  console.log("========================================")

  return parseInt(await question("Selecione a opção: ", personagemSelecionado.id));
}

export async function menuTrabalhar(personagemId) {
  try {
    const personagem = buscaPersonagem(personagemId)

    const urlEmprego = "https://emilyspecht.github.io/the-cresim/empregos.json"
    const empregos = await getDados(urlEmprego) 
    const opcaoTrabalho = await exibirEmpregos(personagem, empregos)  
    const TEMPO_TRABALHO = 20000           
    
      
    trabalhar(personagem.id, empregos, opcaoTrabalho)
    
    console.log(`\n${personagem.nome} esta trabalhando...`)
    await new Promise(resolve => setTimeout(resolve, TEMPO_TRABALHO));
    console.log(`\n${personagem.nome} terminou sua jornada de trabalho!`)

    await mensagemContinue()
  } catch (error) {
    console.log(error.message)
    await mensagemContinue()
  }
}

// DORMIR
export async function menuDormir(personagemId) {
  try {
    const personagem = await buscaPersonagem(personagemId)

    console.clear()
    console.log("================ DORMIR ================")
    const tempo = parseInt(await question("Digite o tempo que deseja dormir (em segundos): ", personagem.id));
    dormir(personagem.id, tempo)
    console.clear()
    console.log("================ DORMIR ================")
    console.log(`${personagem.nome} esta dormindo...`)
  
    await new Promise(resolve => setTimeout(resolve, tempo * 1000));
    console.clear()
    console.log("================ DORMIR ================")
    console.log(`${personagem.nome} acordou!`)
  
    await mensagemContinue()
  } catch (error) {
    console.log(error.message)
    await mensagemContinue()
  }
}

// BANHO
export async function menuTomarBanho(personagemId) {
  try {
    const personagem = buscaPersonagem(personagemId)

    tomarBanho(personagem.id)
    console.clear()
    console.log("================ BANHO ================")
    console.log(`${personagem.nome} está tomando banho...`)
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.clear()
    console.log("================ BANHO ================")
    console.log(`${personagem.nome} terminou seu banho!`)

    await mensagemContinue()
  } catch (error) {
    console.log(error.message)
    await mensagemContinue()
  }
}

// ITENS
export async function menuComprarItem(personagemId) {
  try {
    const itens = await buscarItens()
    const personagem = buscaPersonagem(personagemId)

    console.clear()
    exibirPersonagemSelecionado(personagemId)
    console.log("============== COMPRAR ITEM ==============")
    console.log("ID | ITEM (PONTOS)     | VALOR | CATEGORIA")
    console.log("------------------------------------------")
    for (const item of itens) {
      console.log(`${item.id}. ${item.nome} (${item.pontos}) - R$ ${item.preco} - ${item.categoria}`)
    }
    console.log("------------------------------------------")
    console.log("0. Voltar")
    console.log("==========================================")

    if(personagem.cresceleons === 0) {
      console.log("Você não possui dinheiro para comprar itens.")

      return await mensagemContinue()
    }
    let itemSelecionado = null
    do {
      itemSelecionado = parseInt(await question("Selecione uma opção para compra:", personagemId));

      if (itemSelecionado < 1 || itemSelecionado > itens.length) {
        console.log("Item inválido.")
      }

      if (itemSelecionado === 0) return
    } while (!itemSelecionado || itemSelecionado < 0 || itemSelecionado > itens.length)

    await comprarItem(personagemId, itens[itemSelecionado - 1])

    console.clear()
    console.log("============== COMPRAR ITEM ==============")
    console.log(`${itens[itemSelecionado-1].nome} foi comprado com sucesso.`)

    await mensagemContinue()
  } catch (error) {
    console.log(error.message)
    await mensagemContinue()
  }
}

// HABILIDADES
export async function menuEvoluirHabilidade(personagemId) {
  try {
    const personagem = await buscaPersonagem(personagemId)

    console.clear()
    exibirPersonagemSelecionado(personagemId)
    console.log("=============== MEUS ITENS ===============")
    let index = 1

    if (!personagem.itens.length) {
      console.log("Você não possui itens para evoluir habilidade.")
      console.log("==========================================")
      return await mensagemContinue()
    }

    for (const item of personagem.itens) {
      console.log(`${index}. ${item.nome} (${item.pontos}) - ${item.categoria}`)
      index++
    }
    console.log("------------------------------------------")
    console.log("0. Voltar")
    console.log("==========================================")
    const itemSelecionado = parseInt(await question("Selecione um item para evoluir habilidade:", personagemId))
    await evoluirHabilidade(personagemId, personagem.itens[itemSelecionado - 1])

    if (itemSelecionado === 0) return
    console.clear()
    console.log(`${personagem.nome} está evoluindo a habilidade...`)
    await new Promise(resolve => setTimeout(resolve, 8000))
    console.clear()
    console.log(`${personagem.nome} evoluiu a habilidade ${personagem.itens[itemSelecionado - 1].categoria.toLowerCase()}!`)
    
    await mensagemContinue()
  } catch (error) {
    console.log(error)
  }
}

// RELACIONAMENTO
export async function menuRelacionamento(personagemId) {
  try {
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

    await mensagemContinue()
  } catch (error) {
    console.log(error.message)
    await mensagemContinue()
  }
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

// CHEATS
export async function question(pergunta, personagemId) {
  let valorEhCheat = false
  let value
  do {
    value = await useQuestion(pergunta)
    const resultado = await aplicaCheat(personagemId, value)

    if (resultado) {
      valorEhCheat = true
      console.log('Um cheat foi aplicado')
    } else {
      valorEhCheat = false
    }
  } while(valorEhCheat)
  return value
}

export function exibirPersonagemSelecionado(personagemId) {
  const personagem = buscaPersonagem(personagemId)
  const habilidade = personagem.habilidades[personagem.aspiracao]

  const nome = `😀 ${personagem.nome} (♥️ ${personagem.vida})`
  const energIcone = personagem.energia > 10 ? '🔋' : '🪫'
  const energia = `${energIcone} ${Number(personagem.energia).toFixed(2)}`
  const aspiracao = `💼 ${personagem.aspiracao}`
  const cresceleons = `💰 ${personagem.cresceleons}`
  const nivelHabilidade = `${habilidade.nivel} (${habilidade.pontos})`

  console.log(`${nome} | ${energia} | ${cresceleons} | ${aspiracao} - ${nivelHabilidade}`)
}

export async function mensagemContinue() {
  await useQuestion("\nPressione ENTER para continuar...")
  console.clear()
}