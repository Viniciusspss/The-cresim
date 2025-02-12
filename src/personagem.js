import { useLocalStorage } from "./services/local-storage/use-local-storage.js"

const localStore = useLocalStorage()

export function criarPersonagem(nome) {
  const ATRIBUTOS_INICIAIS_HABILIDADES = {
    nivel: 'JUNIOR',
    pontos: 0
  }

  const personagem = {
    id: Date.now(),
    nome,
    vida: 3600000,
    energia: 32,
    higiene: 28,
    cresceleons: 1500,
    aspiracao: null,
    itens: [],
    relacionamentos: {},
    habilidades: {
      'GASTRONOMIA': ATRIBUTOS_INICIAIS_HABILIDADES,
      'PINTURA': ATRIBUTOS_INICIAIS_HABILIDADES,
      'JOGOS': ATRIBUTOS_INICIAIS_HABILIDADES,
      'JARDINAGEM': ATRIBUTOS_INICIAIS_HABILIDADES,
      'MUSICA': ATRIBUTOS_INICIAIS_HABILIDADES,
    },
  }

  const personagens = localStore.getObject('personagens') ?? []

  personagem.relacionamentos = personagens.reduce((acc, p) => {
    if (p.nome && p.nome !== nome) { 
      acc[p.nome] = {};
      acc[p.nome].pontos = 0;
      acc[p.nome].tipo = "NEUTRO";
    }
    return acc;
  }, {});
  
  personagens.forEach((p) => {
    if (p.nome !== nome) {  
      if (!p.relacionamentos[nome]) {
        p.relacionamentos[nome] = {}; 
      }

      p.relacionamentos[nome].pontos = 0;
      p.relacionamentos[nome].tipo = 'NEUTRO';    
    }
  });
  

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
    throw new Error('Personagem não encontrado')
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