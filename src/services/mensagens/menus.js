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