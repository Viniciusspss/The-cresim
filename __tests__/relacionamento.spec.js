import { relacionarPersonagens } from "../src/interacoes"
import { atualizaPersonagem, criarPersonagem } from "../src/personagem";
import { exibirMenuDeRelacionamento } from "../src/services/mensagens/menus";


describe('Relacionamento', () => {
    it('Deve evoluir o relacionamento de dois Cresims para AMIZADE', async () =>  {
        const personagemPrincipal = criarPersonagem("Joao")
        const personagemInteracao = criarPersonagem("Ana")

        const interacao = {
            id: 3,
            interacao: "Elogiar",
            pontos: 6,
            energia: 1
        };

        let [novoPersonagemPrincipal, novoPersonagemInteracao] = relacionarPersonagens(personagemPrincipal, personagemInteracao, interacao);
        [novoPersonagemPrincipal, novoPersonagemInteracao] = relacionarPersonagens(novoPersonagemPrincipal, novoPersonagemInteracao, interacao);


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
            interacao: "Criticar",
            pontos: -3,
            energia: 1
        };

        let [novoPersonagemPrincipal, novoPersonagemInteracao] = relacionarPersonagens(personagemPrincipal, personagemInteracao, interacao);
        [novoPersonagemPrincipal, novoPersonagemInteracao] = relacionarPersonagens(novoPersonagemPrincipal, novoPersonagemInteracao, interacao);


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
            interacao: "Criticar",
            pontos: -3,
            energia: 2
        };
                
        const [novoPersonagemPrincipal, novoPersonagemInteracao] = relacionarPersonagens(personagemPrincipal, personagemInteracao, interacao);
        const energiaJoao = novoPersonagemPrincipal.energia;
        const energiaAna = novoPersonagemInteracao.energia;
        const energiaEsperadaJoao = 30 // desconta 2 de energia
        const energiaEsperadaMaria = 31 // desconta 1 de energia (metade de 2)

        expect(energiaJoao).toBe(energiaEsperadaJoao)
        expect(energiaAna).toBe(energiaEsperadaMaria)
    })
})