import { buscarItens, comprarItem } from "../src/itens"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem"

describe('Itens', () => {
	it('Deve conseguir comprar um item de habilidade', async () => {
		const personagem = criarPersonagem()
		const [item] = await buscarItens()

		personagem.cresceleons = 3000
		atualizaPersonagem(personagem)
		const novoPersonagem = await comprarItem(personagem.id, item)

		expect(novoPersonagem).toMatchObject({
			cresceleons: personagem.cresceleons - item.preco,
			itens: [item],
		})
	})

	it('Deve validar ao tentar comprar um item de habilidade sem Cresceleons suficientes', async () => {
		const personagem = criarPersonagem()
		const itens = await buscarItens()
		
		personagem.cresceleons = 0
		atualizaPersonagem(personagem)
		const item = {...itens[0], preco: personagem.cresceleons + 1}

		await expect(comprarItem(personagem.id, item)).rejects.toThrow('Cresceleons insuficientes')
	})
})
