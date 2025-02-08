import { useQuestion } from './src/services/question/use-question.js'
import { useLocalStorage } from './src/services/local-storage/use-local-storage.js'

async function criarPersonagem(nome, aspiracao) {
  const personagem = {};
  personagem.nome = nome;
  personagem.vida = 3600000;
  personagem.energia = 32;
  personagem.higiene = 28;
  personagem.cresceleons = 1500;      

  switch (aspiracao) {
      case 1:
          personagem.aspiracao = "GASTRONOMIA";
          break;
      case 2:
          personagem.aspiracao = "PINTURA";
          break;
      case 3:
          personagem.aspiracao = "JOGOS";
          break;
      case 4:
          personagem.aspiracao = "JARDINAGEM";
          break;
      case 5:
          personagem.aspiracao = "MÚSICA";
          break;

      default:
          console.log("Opção inválida. Escolha um número de 1 a 5.");
          break;
  }     

  return personagem;
}

async function menuInicial() {
  console.log("\n============== MENU ==============")
  console.log("1. Criar novo personagem")
  console.log("2. Selecionar personagem")
  console.log("0. Sair do jogo")
  console.log("==================================")

  return parseInt(await useQuestion("\nSelecione a opção:"));
}

async function menuAspiracao() {
  console.log("\nEscolha uma aspiração:");
  console.log("1. GASTRONOMIA");
  console.log("2. PINTURA");
  console.log("3. JOGOS");
  console.log("4. JARDINAGEM");
  console.log("5. MÚSICA");

  return parseInt(await useQuestion("\nSelecione a opção: "));
}

const main = async () => {
  const localStorage = useLocalStorage() 
  let opcao = 0;
  let finalizarJogo = false 

  while (!finalizarJogo) {
      do {
        opcao = await menuInicial()
      } while (opcao < 0 || opcao > 2)
  
      switch (opcao) {
          case 1:                
              const nome = await useQuestion("\nQual o nome do personagem? ");
              let aspiracao = 0 
              
              do {
                  aspiracao = await menuAspiracao()
                  
                  if(aspiracao < 1 || aspiracao > 5) {
                      console.log("\nOpção inválida.")
                  }
              } while (aspiracao < 1 || aspiracao > 5)  
  
              const personagem = await criarPersonagem(nome, aspiracao);

              console.clear();
              console.log("\nPersonagem criado!\n");            
              await useQuestion("Pressione ENTER para continuar...")                            
              localStorage.setObject('personagens' ,[...localStorage.getObject('personagens'), personagem ])          
              console.clear(); 
              break;
  
          case 2:
              console.log()
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

  // localStorage.setString('nome-string', nome)
  // localStorage.setObject('nome-obj', { nome })
  // // localStorage.setObject('nome-array', [{nome}])

  // localStorage.setObject('nome-array', [ ...localStorage.getObject('nome-array'), { nome }])
  
  // console.log(localStorage.getString('nome-string'))
  // console.log(localStorage.getObject('nome-obj'))
  // console.log(localStorage.getObject('nome-array'))

