import { useQuestion } from "./services/question/use-question"
import { aplicaCheat } from './cheats'

export async function question(pergunta, personagemId) {
  let valorEhCheat = false
  let value

  do {
    value = await useQuestion(pergunta)

    if (!personagemId) {
      break
    }

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