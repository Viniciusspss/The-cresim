import { tomarBanho } from "../src/interacoes"
import { buscaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"

describe('Higiene', () => {
    beforeEach(() => {
      let localStorage = useLocalStorage()
      localStorage.setObject('personagens', [])
    })
    
    it('Deve descontar 10 Cresceleons ao tomar banho', async () => {
        const personagem = criarPersonagem('Cleitin')
        tomarBanho(personagem.id)
        const personagemAtualizado = buscaPersonagem(personagem.id)
        const cresceleonsEsperados = 1490
        expect(personagemAtualizado.cresceleons).toBe(cresceleonsEsperados)
    })
})
