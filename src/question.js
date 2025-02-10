import { useQuestion } from "./services/question/use-question"
import { aplicaCheat } from './cheats'

export async function question(pergunta, personagemId) {
  const value = await useQuestion(pergunta)

  await aplicaCheat(personagemId, value)

  return value
}