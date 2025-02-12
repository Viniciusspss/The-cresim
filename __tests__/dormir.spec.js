import { dormir } from '../src/dormir'
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"

describe('Testes de Dormir', () => {
  beforeEach(() => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])
  })

  it('Deve conseguir dormir e receber seus pontos de energia', async ()=> {
    let personagem = criarPersonagem("Cresinho")
    personagem.energia = 10
    personagem = atualizaPersonagem(personagem)
    
    const personagemAtualizado = dormir(personagem.id, 10)

    expect(personagemAtualizado.energia).toBe(20)
  })

  it('Deve retornar um erro se o tempo de sono for menor que 0', async () => {

    let personagem = criarPersonagem("Cresinho")
 
    expect(()=>dormir(personagem.id, -1)).toThrow("Insira um tempo válido.")
  })
})
