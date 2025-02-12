import { relacionarPersonagens } from "../src/interacoes"
import { criarPersonagem } from "../src/personagem";
import { useLocalStorage } from "../src/services/local-storage/use-local-storage";

describe('Relacionamento', () => {
    beforeEach(() => {
        let localStorage = useLocalStorage()
        localStorage.setObject('personagens', [])
    })
    
    it('Deve evoluir o relacionamento de dois Cresims para AMIZADE', async () =>  {
        const personagemPrincipal = criarPersonagem("Joao")
        const personagemInteracao = criarPersonagem("Ana")

        const interacao = {
            id: 3,
            pontos: 6,
            energia: 1
        };

        let [novoPersonagemPrincipal, novoPersonagemInteracao] = await relacionarPersonagens(personagemPrincipal.id, personagemInteracao.id, interacao);
        [novoPersonagemPrincipal, novoPersonagemInteracao] = await relacionarPersonagens(novoPersonagemPrincipal.id, novoPersonagemInteracao.id, interacao);

        const tipoJoaoComAna = novoPersonagemPrincipal.relacionamentos[novoPersonagemInteracao.nome].tipo;
        const tipoAnaComJoao = novoPersonagemInteracao.relacionamentos[novoPersonagemPrincipal.nome].tipo;
        const tipoEsperado = "AMIZADE";    

        expect(tipoJoaoComAna).toBe(tipoEsperado)
        expect(tipoAnaComJoao).toBe(tipoEsperado)
    })

    it('Deve recuar o relacionamento de dois Cresims para INIMIZADE', async () =>  {
        const personagemPrincipal = criarPersonagem("Joao")
        const personagemInteracao = criarPersonagem("Ana")

        const interacao = {
            id: 3,
            pontos: -3,
            energia: 1
        };

        let [novoPersonagemPrincipal, novoPersonagemInteracao] = await relacionarPersonagens(personagemPrincipal.id, personagemInteracao.id, interacao);
        [novoPersonagemPrincipal, novoPersonagemInteracao] = await relacionarPersonagens(novoPersonagemPrincipal.id, novoPersonagemInteracao.id, interacao);

        const tipoJoaoComAna = novoPersonagemPrincipal.relacionamentos[novoPersonagemInteracao.nome].tipo;
        const tipoAnaComJoao = novoPersonagemInteracao.relacionamentos[novoPersonagemPrincipal.nome].tipo;
        const tipoEsperado = "INIMIZADE";    

        expect(tipoJoaoComAna).toBe(tipoEsperado)
        expect(tipoAnaComJoao).toBe(tipoEsperado)
    })

    it('Deve descontar os pontos de energia em uma interação entre dois Cresims', async () =>  {
        const personagemPrincipal = criarPersonagem("Joao")
        const personagemInteracao = criarPersonagem("Ana")

        const interacao = {
            id: 6,
            pontos: -3,
            energia: 2
        };
                
        const [novoPersonagemPrincipal, novoPersonagemInteracao] = await relacionarPersonagens(personagemPrincipal.id, personagemInteracao.id, interacao);
        const energiaJoao = novoPersonagemPrincipal.energia;
        const energiaAna = novoPersonagemInteracao.energia;
        const energiaEsperadaJoao = 30 // desconta 2 de energia
        const energiaEsperadaMaria = 31 // desconta 1 de energia (metade de 2)

        expect(energiaJoao).toBe(energiaEsperadaJoao)
        expect(energiaAna).toBe(energiaEsperadaMaria)
    })
})