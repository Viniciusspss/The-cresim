import { useQuestion } from "../question/use-question";
import { criarPersonagem } from "../../personagem";
import { exibeMenuAspiracoes } from "../mensagens/menus";
import { defineAspiracao } from "../../aspiracoes";

export async function menuCriarPersoangem() {
  const nome = await useQuestion("\nQual o nome do personagem? ");
  const personagem = criarPersonagem(nome)

  let aspiracao = null

  do {
    aspiracao = await exibeMenuAspiracoes()
    defineAspiracao(personagem, aspiracao)
  } while (aspiracao === null)

  console.clear();
  console.log("\nPersonagem criado!\n");            
  await useQuestion("Pressione ENTER para continuar...")                           
  console.clear(); 
}