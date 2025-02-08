import { defineAspiracao } from "../src/aspiracoes"
import { criarPersonagem } from "../src/personagem"

describe('Aspiracoes', () => {
  it('Deve conseguir atribuir uma aspiração ao Cresim', async () =>  {
    const aspiracaoEsperada = 'GASTRONOMIA'

    const personagem = criarPersonagem("Cresinho")
    const personagemComAspiracao = defineAspiracao(personagem, 'GASTRONOMIA')

    expect(personagemComAspiracao).toMatchObject({
      aspiracao: aspiracaoEsperada
    })
  })
})
