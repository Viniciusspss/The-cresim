import { defineAspiracao } from "../src/aspiracoes"
import { tomarBanho, trabalhar } from "../src/interacoes"
import { atualizaPersonagem, buscaPersonagem, criarPersonagem } from "../src/personagem"
import { getDados } from "../src/services/requisicoes/requisicoes"

describe('Higiene', () => {
    it('Deve descontar 10 Cresceleons ao tomar banho', async () => {
        const personagem = criarPersonagem('Cleitin')
        tomarBanho(personagem.id)
        const personagemAtualizado = buscaPersonagem(personagem.id)
        const cresceleonsEsperados = 1490
        expect(personagemAtualizado.cresceleons).toBe(cresceleonsEsperados)
    })
})
