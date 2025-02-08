import { useLocalStorage } from "./services/local-storage/use-local-storage"

const localStore = useLocalStorage()

export function criarPersonagem(nome) {
  const personagem = {
    id: Date.now(),
    nome,
    vida: 3600000,
    energia: 32,
    higiene: 28,
    cresceleons: 1500,
  }

  const personagens = localStore.getObject('personagens') ?? []
  localStore.setObject('personagens', [...personagens, personagem])

  return personagem
}

export function buscaPersonagens() {
  return localStore.getObject('personagens') ?? []
}

export function buscaPersonagem(personagemId) {
  const personagens = localStore.getObject('personagens') ?? []
  const personagem = personagens.find(person => person.id === personagemId)

  if (!personagem) {
    console.log("Personagem não encontrado!")
  }
  
  return personagem
}

export function atualizaPersonagem(personagemAtualizado) {
  if (personagemAtualizado.energia < 0) {
    personagemAtualizado.energia = 0
  }

  if (personagemAtualizado.energia > 32) {
    personagemAtualizado.energia = 32
  }

  const personagens = buscaPersonagens(personagemAtualizado.id)

  const personagensAtualizado = personagens.map(personagem => personagem.id === personagemAtualizado.id ? personagemAtualizado : personagem)
  localStore.setObject('personagens', personagensAtualizado)

  return personagemAtualizado
}