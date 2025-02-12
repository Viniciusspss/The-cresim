import { defineAspiracao, evoluirHabilidade } from "../src/habilidade"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"
import { buscarItens } from "../src/itens"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"

describe('Testes de Habilidade', () => {
  beforeEach(() => {
    let localStorage = useLocalStorage()
    localStorage.setObject('personagens', [])
  })

  it('Deve conseguir atribuir uma aspiração ao Cresim', async () =>  {
    const aspiracaoEsperada = 'GASTRONOMIA'

    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, 'GASTRONOMIA')

    expect(personagem).toMatchObject({
      aspiracao: aspiracaoEsperada
    })
  })

  it('Deve conseguir concluir um ciclo de treino com habilidade que não é aspiração e receber os pontos corretamente', async () => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, 'PINTURA')

    const [item] = await buscarItens()

    const personagemComHabilidadeEvoluida = await evoluirHabilidade(personagem.id, item)

    expect(personagemComHabilidadeEvoluida).toMatchObject({
      habilidades: {
        'GASTRONOMIA': {
          pontos: 3
        }
      }
    })
  })

  it('Deve conseguir concluir um ciclo de treino com habilidade que é sua aspiração e receber os pontos corretamente', async() => {
    const personagemCriado = criarPersonagem("Cresinho")
    const personagem = defineAspiracao(personagemCriado.id, 'GASTRONOMIA')

    const [item] = await buscarItens()
    const personagemComHabilidadeEvoluida = await evoluirHabilidade(personagem.id, item)

    expect(personagemComHabilidadeEvoluida).toMatchObject({
      habilidades: {
        'GASTRONOMIA': {
          nivel: 'JUNIOR',
          pontos: 4
        },
        'PINTURA': {
          nivel: 'JUNIOR',
          pontos: 0
        },
        'JOGOS': {
          nivel: 'JUNIOR',
          pontos: 0
        },
        'JARDINAGEM': {
          nivel: 'JUNIOR',
          pontos: 0
        },
        'MUSICA': {
          nivel: 'JUNIOR',
          pontos: 0
        },
      }
    })
  })

  it('Deve perder pontos de energia ao terminar um ciclo de treino', async () => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, 'GASTRONOMIA')

    const [item] = await buscarItens()
    const personagemComHabilidadeEvoluida = await evoluirHabilidade(personagem.id, item)

    expect(personagemComHabilidadeEvoluida).toMatchObject({
      energia: 28
    })
  })

  it('Deve lançar um erro ao tentar treinar sem energia suficiente', async () => {
    let personagem = criarPersonagem("Cresinho")
    personagem = defineAspiracao(personagem.id, 'GASTRONOMIA')

    const [item] = await buscarItens()

    personagem.energia = 0
    personagem.cresceleons = 20000

    await atualizaPersonagem(personagem)

    expect(async () => {
      await evoluirHabilidade(personagem.id, item)
    }).rejects.toThrowError('Energia insuficiente para treinar')
  })

  it('Deve avançar o nivel de habilidade quando completar os pontos necessarios', async () => {
    const [item] = await buscarItens()
    let personagem = criarPersonagem("Cresinho")
    personagem.cresceleons = 20000
    personagem.habilidades['GASTRONOMIA'].pontos = 16

    await atualizaPersonagem(personagem)

    personagem = defineAspiracao(personagem.id, 'GASTRONOMIA')
    const personagemComNivelHabilidadeEvoluido = await evoluirHabilidade(personagem.id, item)
    
    expect(personagemComNivelHabilidadeEvoluido.habilidades).toMatchObject({
      'GASTRONOMIA': {
        nivel: 'PLENO',
        pontos: 20,
      }
    })
  })

  it('Deve lançar um erro ao tentar treinar sem higiene', async () => {})

  it('Deve evoluir nível para SÊNIOR ao atingir mais de 26 pontos', async () => {})
})
