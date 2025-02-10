import { useQuestion } from '../question/use-question.js'
import { buscaPersonagens } from '../../personagem.js'

export async function exibeMenuInicial() {
  console.log("\n============== MENU ==============")
  console.log("1. Criar novo personagem")
  console.log("2. Selecionar personagem")
  console.log("0. Sair do jogo")
  console.log("==================================")

  return parseInt(await useQuestion("\nSelecione a opção:"));
}

export async function exibeMenuAspiracoes() {
  console.log("\nEscolha uma aspiração:");
  console.log("1. GASTRONOMIA");
  console.log("2. PINTURA");
  console.log("3. JOGOS");
  console.log("4. JARDINAGEM");
  console.log("5. MÚSICA");

  const aspiracaoSelecionada = parseInt(await useQuestion("\nSelecione a opção: "));

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

export async function exibirPersonagens(){
  const personagens = buscaPersonagens()  

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
    const personagemSelecionado = parseInt(await useQuestion("\nSelecione a opção: "));
    return personagens[personagemSelecionado - 1]
  } catch (error) {
    console.log("\nEsse personagem não existe")
    return null
  }
  
}

export async function exibirInteracoes(personagemSelecionado){
  if(!personagemSelecionado){
    console.log("\nNenhum personagem selecionado")
    return null
  }
  console.log(`\nPersonagem selecionado: ${personagemSelecionado.nome}`)
  console.log("\n============== ATIVIDADES ==============")
  console.log("1. Dormir")
  console.log("2. Trabalhar")
  console.log("3. Comprar item")
  console.log("4. Relacionamento")
  console.log("==========================================")

  return parseInt(await useQuestion("\nSelecione a opção: "));

}

export async function exibirEmpregos(personagemSelecionado, empregos) {
  console.clear()
  console.log(`\nPersonagem selecionado: ${personagemSelecionado.nome}`)
  console.log("\n============== EMPREGOS ==============")
  empregos.forEach((emprego, index) => {
    console.log(`${index + 1}. ${emprego.cargo}`)
  })
  console.log("==========================================")

  return parseInt(await useQuestion("\nSelecione a opção: "));
}

export async function exibirOpcoesDeRelacionamento(personagemSelecionado) {
  const personagens = buscaPersonagens()
  let contador = 1;  
  let personagensDisponiveis = []

  if (personagens.length > 0) {
    console.log("\n============== PERSONAGENS DISPONÍVEIS ==============")
    personagens.forEach((personagem) => {
      if (personagem.nome !== personagemSelecionado.nome) {
        console.log(`${contador}. ${personagem.nome}`)
        personagensDisponiveis.push(personagem) 
        contador++
      }
    });
    console.log("=========================================================")
  }
  else {
    console.log("Não há personagens para se relacionar.") 
    return null   
  }

  try {
    const opcao = parseInt(await useQuestion("\nSelecione um personagem para se relacionar: "));

    if (isNaN(opcao) || opcao < 1 || opcao >= contador) {
      console.log("\nEsse personagem não existe")
      return null
    }

    return personagensDisponiveis[opcao - 1]
  } 
  catch (error) {
    console.log("\nErro ao selecionar o personagem.")
    return null
  }  
}

export async function exibirMenuDeRelacionamento(personagemSelecionado, personagemRelacao) {
  const pontosRelacionamento = personagemSelecionado.relacionamentos[personagemRelacao.nome];
  let relacionamentoDescricao = `Relacionamento com ${personagemRelacao.nome}: `;  

  let opcoes = [];

  if (pontosRelacionamento < 0) {
    relacionamentoDescricao += "INIMIZADE\n";
    opcoes.unshift("INIMIZADE");
  } 
  else {
    opcoes.push("NEUTRO");
    relacionamentoDescricao += "NEUTRO\n";
    
    if (pontosRelacionamento >= 11 && pontosRelacionamento <= 25) {
      relacionamentoDescricao += "AMIZADE\n";
      opcoes.push("AMIZADE");
    } 
    else if (pontosRelacionamento > 25) {
      relacionamentoDescricao += "AMOR\n";
      opcoes.push("AMIZADE");
      opcoes.push("AMOR");
    }
  }

  console.log(relacionamentoDescricao);
  console.log("========== AÇÕES DE RELACIONAMENTO ==========");
  
  opcoes.forEach((opcao, index) => {
    console.log(`${index + 1}. ${opcao}`);
  });
  
  console.log("=============================================\n");

  const op = parseInt(await useQuestion("\nSelecione a opção: "));
  
  if (isNaN(op) || op < 1 || op > opcoes.length) {
    console.log("\nOpção inválida!\n");
    return null;
  }
  
  return opcoes[op - 1];
}