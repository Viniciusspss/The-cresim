import { defineAspiracao } from "../src/habilidade"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"
import { getDados } from "../src/services/requisicoes/requisicoes"
import { trabalhar } from "../src/trabalho"

describe('Teste de trabalho', () => {
  let trabalhos
  let personagem

  beforeEach(async () => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])

    const urlEmpregos = "https://emilyspecht.github.io/the-cresim/empregos.json"
    trabalhos = await getDados(urlEmpregos)

    personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, "JOGOS")
  })

  it('Deve perder os pontos de energia ao trabalhar uma jornada padrão', async ()=> {

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)

    expect(personagemAtualizado.energia).toBe(22)
  })

  it('Deve receber o salario do dia ao trabalhar uma jornada padrão', async ()=> {

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)

    expect(personagemAtualizado.cresceleons).toBe(1660)
  })

  it('Deve receber o salario equivalente quando começar a trabalhar com os pontos de energia menores que 10', async () => {

    personagem.energia = 9
    await atualizaPersonagem(personagem)

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)
    expect(personagemAtualizado.cresceleons).toBe(1607.2)
  })

  it('Deve validar para que o Cresim não consiga começar a trabalhar com os pontos de energia menores que 4', async () => {

    personagem.energia = 3
    await atualizaPersonagem(personagem)
    
    expect(() => trabalhar(personagem.id, trabalhos, 1)).toThrow("Seu personagem está muito cansado e não pode trabalhar!")
  })

  it('Deve retornar um erro se a higiene for menor que 4', async () => {
    personagem.higiene = 3
    await atualizaPersonagem(personagem)

    expect(() => trabalhar(personagem.id, trabalhos, 1)).toThrow("Seu personagem precisa tomar banho para trabalhar")

  })

  it('Deve atualizar corretamente se energia for 11', async () => {
    personagem.energia = 11
    await atualizaPersonagem(personagem)

    const personagemAtualizado = trabalhar(personagem.id, trabalhos, 1)
    const salarioEsperado = 1644
    const vidaEsperada = 3582000
    const higieneEsperada = 24.4

    expect(personagemAtualizado.cresceleons).toBe(salarioEsperado)
    expect(personagemAtualizado.vida).toBe(vidaEsperada)
    expect(personagemAtualizado.higiene).toBe(higieneEsperada)
  })
})
