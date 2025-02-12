import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"

describe('Teste de Personagem', () => {
  beforeEach(() => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])
  })

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

  it('Deve lançar erro se o personagem não for encontrado', async () => {})
})
