import { atualizaPersonagem, buscaPersonagem } from "./personagem"

export function tomarBanho(idPersonagem){
  const personagem = buscaPersonagem(idPersonagem)
  personagem.cresceleons -= 10
  personagem.higiene = 28

  atualizaPersonagem(personagem)
  return personagem
}