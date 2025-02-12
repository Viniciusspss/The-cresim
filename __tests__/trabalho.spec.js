import { defineAspiracao } from "../src/habilidade"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"
import { getDados } from "../src/services/requisicoes/requisicoes"
import { trabalhar } from "../src/trabalho"

describe('Teste de trabalho', () => {
  beforeEach(() => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])
  })

  it('Deve perder os pontos de energia ao trabalhar uma jornada padrão', async ()=> {
    const urlEmpregos = "https://emilyspecht.github.io/the-cresim/empregos.json"
    const trabalhos = await getDados(urlEmpregos)

    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, "JOGOS")

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)

    expect(personagemAtualizado.energia).toBe(22)
  })

  it('Deve receber o salario do dia ao trabalhar uma jornada padrão', async ()=> {
    const urlEmpregos = "https://emilyspecht.github.io/the-cresim/empregos.json"
    const trabalhos = await getDados(urlEmpregos) 

    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, "JOGOS")

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)

    expect(personagemAtualizado.cresceleons).toBe(1660)
  })

  it('Deve receber o salario equivalente quando começar a trabalhar com os pontos de energia menores que 10', async () => {
    const urlEmpregos = "https://emilyspecht.github.io/the-cresim/empregos.json"
    const trabalhos = await getDados(urlEmpregos) 

    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, "JOGOS")
    personagem.energia = 9
    await atualizaPersonagem(personagem)

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)
    expect(personagemAtualizado.cresceleons).toBe(1607.2)
  })

  it('Deve validar para que o Cresim não consiga começar a trabalhar com os pontos de energia menores que 4', async () => {
    const urlEmpregos = "https://emilyspecht.github.io/the-cresim/empregos.json"
    const trabalhos = await getDados(urlEmpregos)

    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, "JOGOS")
    personagem.energia = 3
    await atualizaPersonagem(personagem)
    
    expect(() => trabalhar(personagem.id, trabalhos, 1)).toThrow("Seu personagem está muito cansado e não pode trabalhar!")
  })

  it('Deve retornar um erro se a higiene for menor que 4', async () => {
    // TODO: Implementar teste
  })

  it('Deve atualizar corretamente se energia for 11', async () => {
    // TODO: Implementar teste
  })
})
