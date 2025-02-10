import { defineAspiracao, evoluirHabilidade } from "../src/aspiracoes"
import { criarPersonagem } from "../src/personagem"
import { buscarItens } from "../src/itens"

describe('Aspiracoes', () => {
  it('Deve conseguir atribuir uma aspiração ao Cresim', async () =>  {
    const aspiracaoEsperada = 'GASTRONOMIA'

    const personagem = criarPersonagem("Cresinho")
    const personagemComAspiracao = defineAspiracao(personagem, 'GASTRONOMIA')

    expect(personagemComAspiracao).toMatchObject({
      aspiracao: aspiracaoEsperada
    })
  })

  it('Deve conseguir concluir um ciclo de treino com habilidade que não é aspiração e receber os pontos corretamente', async () => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem, 'PINTURA')

    const [item] = await buscarItens()

    const personagemComHabilidadeEvoluida = await evoluirHabilidade(personagem, item.categoria, item)

    expect(personagemComHabilidadeEvoluida).toMatchObject({
      habilidades: {
        'GASTRONOMIA': {
          pontos: 3
        }
      }
    })
  })

  it('Deve conseguir concluir um ciclo de treino com habilidade que é sua aspiração e receber os pontos corretamente', async() => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem, 'GASTRONOMIA')

    const [item] = await buscarItens()
    const personagemComHabilidadeEvoluida = await evoluirHabilidade(personagem, item.categoria, item)

    expect(personagemComHabilidadeEvoluida).toMatchObject({
      habilidades: {
        'GASTRONOMIA': {
          nivel: 'junior',
          pontos: 4
        },
        'PINTURA': {
          nivel: 'junior',
          pontos: 0
        },
        'JOGOS': {
          nivel: 'junior',
          pontos: 0
        },
        'JARDINAGEM': {
          nivel: 'junior',
          pontos: 0
        },
        'MUSICA': {
          nivel: 'junior',
          pontos: 0
        },
      }
    })
  })

  it('Deve perder pontos de energia ao terminar um ciclo de treino', async () => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem, 'GASTRONOMIA')

    const [item] = await buscarItens()
    const personagemComHabilidadeEvoluida = await evoluirHabilidade(personagem, item.categoria, item)

    expect(personagemComHabilidadeEvoluida).toMatchObject({
      energia: 28
    })
  })

  it('Deve lançar um erro ao tentar treinar sem energia suficiente', async () => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem, 'GASTRONOMIA')

    const [item] = await buscarItens()

    personagem.energia = 3
    personagem.cresceleons = 20000

    expect(async () => {
      await evoluirHabilidade(personagem, item.categoria, item)
    }).rejects.toThrowError('Energia insuficiente para treinar')
  })

  it('Deve avançar o nivel de habilidade quando completar os pontos necessarios', async () => {
    const [item] = await buscarItens()
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem, 'GASTRONOMIA')

    personagem.habilidades['GASTRONOMIA'].pontos = 16

    const personagemComNivelHabilidadeEvoluido = await evoluirHabilidade(personagem, item.categoria, item)
    
    expect(personagemComNivelHabilidadeEvoluido.habilidades).toMatchObject({
      'GASTRONOMIA': {
        nivel: 'pleno',
        pontos: 20,
      }
    })
  })
})
