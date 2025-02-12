import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { defineAspiracao } from '../src/habilidade'
import { aplicaCheat } from "../src/cheats"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"
import { getDados } from "../src/services/requisicoes/requisicoes"
import { trabalhar } from "../src/trabalho"

describe('Testes de Cheats', () => {
  beforeEach(() => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])
  })

  afterAll(() => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])
  })
  
  it('Deve conseguir aplicar o cheat SORTENAVIDA e receber as recompensas', async () => {
    const urlEmpregos = "https://emilyspecht.github.io/the-cresim/empregos.json"
    const trabalhos = await getDados(urlEmpregos)

    let personagem = criarPersonagem("Cresinho")
    personagem = await aplicaCheat(personagem.id, "SORTENAVIDA")

    const id = personagem.id


    const personagemAtualizado = trabalhar(id, trabalhos, 1)
    const salarioEsperado = 1676
    
    expect(personagemAtualizado.cresceleons ).toBe(salarioEsperado)
  })

  it('Deve conseguir aplicar o cheat DEITADONAREDE e receber as recompensas', async () => {
    let personagem = criarPersonagem('Cleitin')
    personagem = defineAspiracao(personagem.id, 'JOGOS')
    personagem.energia = 10
    atualizaPersonagem(personagem)

    const valorEsperado = personagem.energia + 5
    const personagemAtualizado = await aplicaCheat(personagem.id, 'DEITADONAREDE')

    expect(personagemAtualizado.energia).toBe(valorEsperado)
  })

  it('Deve conseguir aplicar o cheat JUNIM e receber as recompensas', async () => {
    let personagem = criarPersonagem('Cleitin')
    personagem = defineAspiracao(personagem.id, 'JOGOS')
    
    const personagemAtualizado = await aplicaCheat(personagem.id, 'JUNIM')
    const valorEsperado = 5

    expect(personagemAtualizado.habilidades[personagem.aspiracao].pontos).toBe(valorEsperado)
  })

  it('Deve conseguir aplicar o cheat CAROLINAS e receber as recompensas para a habilidade escolhida', async () => {
    let personagem = criarPersonagem('Cleitin')
    personagem = defineAspiracao(personagem.id, 'JOGOS')
    
    const personagemAtualizado = await aplicaCheat(personagem.id, 'CAROLINAS')
    const valorEsperado = personagem.vida + 100000

    expect(personagemAtualizado.vida).toBe(valorEsperado)
  })

  it('Deve conseguir aplicar o cheat SINUSITE ter a vida zerada', async () => {
    let personagem = criarPersonagem('Cleitin')
    personagem = defineAspiracao(personagem.id, 'JOGOS')
    
    const personagemAtualizado = await aplicaCheat(personagem.id, 'SINUSITE')
    const valorEsperado = 0

    expect(personagemAtualizado.vida).toBe(valorEsperado)
  })
})