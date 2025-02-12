import { tomarBanho } from "../src/banho"
import { atualizaPersonagem, buscaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"

describe('Testes de Higiene', () => {
    beforeEach(() => {
      let localStorage = useLocalStorage()
      localStorage.setObject('personagens', [])
    })
    
    it('Deve descontar 10 Cresceleons ao tomar banho', async () => {
        const personagem = criarPersonagem('Cleitin')
        const personagemAtualizado = tomarBanho(personagem.id)
        const cresceleonsEsperados = 1490

        expect(personagemAtualizado.cresceleons).toBe(cresceleonsEsperados)
    })
})
