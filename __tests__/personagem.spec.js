import { dormir, trabalhar } from "../src/interacoes"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { defineAspiracao } from "../src/aspiracoes"
import { getDados } from "../src/services/requisicoes/requisicoes"

describe('Personagem', () => {
  it('Deve conseguir criar um novo Cresim com nome, pontos de higiene e energia carregados e 1500 Cresceleons', async () =>  {
    const nomeEsperado = "Cresinho"
    const higieneEsperado = 28
    const energiaEsperado = 32
    const cresceleonsEsperado = 1500


    const personagem = criarPersonagem("Cresinho")

    expect(personagem).toMatchObject({
      nome: nomeEsperado,
      higiene: higieneEsperado,
      energia: energiaEsperado,
      cresceleons: cresceleonsEsperado
    })
  })

  it('Deve validar os pontos de energia do personagem para que não passem de 32 pontos', async () => {
    const personagem = criarPersonagem("Cresinho")
    personagem.energia = 40
    
    const personagemAtualizado = atualizaPersonagem(personagem)

    expect(personagemAtualizado.energia).toBe(32)
  })

  it('Deve validar os pontos de energia do personagem para que não fiquem negativados', async () => {
    const personagem = criarPersonagem("Cresinho")
    personagem.energia = -10
    
    const personagemAtualizado = atualizaPersonagem(personagem)

    expect(personagemAtualizado.energia).toBe(0)
  })

  it('Deve conseguir dormir e receber seus pontos de energia', async ()=> {
    let personagem = criarPersonagem("Cresinho")
    personagem.energia = 10
    personagem = atualizaPersonagem(personagem)
    
    const personagemAtualizado = dormir(personagem.id, 10)

    expect(personagemAtualizado.energia).toBe(20)
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

    const resultado = trabalhar(personagem.id, trabalhos, 1)
    expect(resultado).toBeNull()
  })
})
