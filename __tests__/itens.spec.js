import { buscarItens, comprarItem } from "../src/itens"
import { criarPersonagem } from "../src/personagem"
import { useLocalStorage } from "../src/services/local-storage/use-local-storage"

describe('Itens', () => {
	let localStorage = useLocalStorage()

  beforeEach(() => {
    localStorage.setObject('personagens', [])
  })

  afterAll(() => {
    localStorage.setObject('personagens', [])
  })

	it('Deve conseguir comprar um item de habilidade', async () => {
		const personagem = criarPersonagem()
		const [item] = await buscarItens()

		personagem.cresceleons = 3000
		const novoPersonagem = await comprarItem(personagem, item)

		expect(novoPersonagem).toMatchObject({
		cresceleons: personagem.cresceleons - item.preco,
		itens: [item],
		})
	})

	it('Deve validar ao tentar comprar um item de habilidade sem Cresceleons suficientes', async () => {
		const personagem = criarPersonagem()
		const itens = await buscarItens()
		
		personagem.cresceleons = 0
		const item = {...itens[0], preco: personagem.cresceleons + 1}

		await expect(comprarItem(personagem, item)).rejects.toThrow('Cresceleons insuficientes')
	})
})
