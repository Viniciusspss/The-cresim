import { defineAspiracao } from "../src/aspiracoes"
import { tomarBanho, trabalhar } from "../src/interacoes"
import { atualizaPersonagem, buscaPersonagem, criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"
import { getDados } from "../src/services/requisicoes/requisicoes"

describe('Higiene', () => {
    beforeEach(() => {
    const localStorage = useLocalStorage()
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
