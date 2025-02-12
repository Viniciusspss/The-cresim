import { exibeMenuInicial } from "./src/menu"

const main = async () => {
  let finalizarJogo = false

  while (!finalizarJogo) {
    finalizarJogo = await exibeMenuInicial()
  }

  console.clear()
  console.log("===============================")
  console.log("========= FIM DE JOGO =========")
  console.log("===============================")
}

main()
