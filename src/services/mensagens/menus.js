import { useQuestion } from '../question/use-question'

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