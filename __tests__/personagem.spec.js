import { dormir,trabalhar } from "../src/interacoes"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"

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

  it('Deve conseguir dormir e receber seus pontos de energia  ', async ()=> {
    const personagem = criarPersonagem("Cresinho")
    personagem.energia = 10
    dormir(personagem,10)

    expect(personagem.energia).toBe(20)
  })

  it('Deve perder os pontos de energia ao trabalhar uma jornada padrão ', async ()=> {
    const trabalhos = [
      {
          "id": 1,
          "cargo": "Jogador de Dota",
          "categoria": "JOGOS",
          "salario": [
              {"nivel": "JUNIOR", "valor": 160},
              {"nivel": "PLENO", "valor": 250},
              {"nivel": "SENIOR", "valor": 340}
          ]
      }
    ]

    const personagem = criarPersonagem("Cresinho")
    const r = trabalhar(trabalhos, 1)
    // expect(personagem.energia).toBe(22)
  })
})
