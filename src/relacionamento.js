import { atualizaPersonagem, buscaPersonagem } from "./personagem"

export async function relacionarPersonagens(personagemPrincipalId, personagemInteracaoId, interacao) {
    const p1 = await buscaPersonagem(personagemPrincipalId)
    const p2 = await buscaPersonagem(personagemInteracaoId)

    const relacionamentoComP2Existe = p1.relacionamentos[p2.nome]

    if (relacionamentoComP2Existe) {
        p1.relacionamentos[p2.nome] = {
            pontos: relacionamentoComP2Existe.pontos += interacao.pontos,
            tipo: relacionamentoComP2Existe.tipo
        }
    } else {
        p1.relacionamentos[p2.nome] = {
            pontos: interacao.pontos,
            tipo: 'NEUTRO'
        }
    }
    
    p1.energia -= interacao.energia
    p1.vida -= interacao.energia * 2000;

    const relacionamentoComP1Existe = p2.relacionamentos[p1.nome]

    if (relacionamentoComP1Existe) {
        p2.relacionamentos[p1.nome] = {
            pontos: relacionamentoComP1Existe.pontos += interacao.pontos,
            tipo: relacionamentoComP1Existe.tipo
        }
    } else {
        p2.relacionamentos[p1.nome] = {
            pontos: interacao.pontos,
            tipo: 'NEUTRO'
        }
    }

    p2.energia -= Math.ceil(interacao.energia / 2)
    p2.vida -= interacao.energia * 2000; 

    if(p1.relacionamentos[p2.nome].pontos < 0 && p2.relacionamentos[p1.nome].pontos < 0) {
        p1.relacionamentos[p2.nome].tipo = 'INIMIZADE'
        p2.relacionamentos[p1.nome].tipo = 'INIMIZADE'
    }
    else if(p1.relacionamentos[p2.nome].pontos <= 10 && p2.relacionamentos[p1.nome].pontos <= 10) {
        p1.relacionamentos[p2.nome].tipo = 'NEUTRO'
        p2.relacionamentos[p1.nome].tipo = 'NEUTRO'
    }
    else if(p1.relacionamentos[p2.nome].pontos <= 25 && p2.relacionamentos[p1.nome].pontos <= 25) {
        p1.relacionamentos[p2.nome].tipo = 'AMIZADE'
        p2.relacionamentos[p1.nome].tipo = 'AMIZADE'
    }
    else {
        p1.relacionamentos[p2.nome].tipo = 'AMOR'
        p2.relacionamentos[p1.nome].tipo = 'AMOR'
    }   
         

    atualizaPersonagem(p1)
    atualizaPersonagem(p2)
    return [p1, p2]
}