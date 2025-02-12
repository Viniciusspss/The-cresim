import { atualizaPersonagem, buscaPersonagem } from "./personagem.js"

export function dormir (personagem, tempo){
    const personagemAtualizado = personagem
    const TEMPO_INVALIDO = 0;
    if(tempo < TEMPO_INVALIDO){
        console.log("Insira um tempo válido")
    }

    const INTERVALO_SONO = 5
    const ENERGIA_POR_INTERVALO = 4
    const BONUS_ENERGIA = 2
    const tempoDormido = tempo/INTERVALO_SONO
    let pontosEnergia = tempoDormido*ENERGIA_POR_INTERVALO
    for (let i = 1; i < tempoDormido; i++) {
        pontosEnergia+=BONUS_ENERGIA
    }

    personagemAtualizado.energia += pontosEnergia

    atualizaPersonagem(personagemAtualizado)

    return personagemAtualizado

}


export function trabalhar (personagem, empregos, idEmprego){
    const emprego = empregos.find(emp => emp.id === idEmprego)

    const nivelHabilidade = personagem.habilidades[emprego.categoria].nivel.toUpperCase()
    let salarioDiario = emprego.salario.find(s => s.nivel === nivelHabilidade).valor
    const personagemAtualizado = personagem

    if(personagemAtualizado.energia <= 4){
        throw new Error("Seu personagem está muito cansado e não pode trabalhar!")
    }

    if(personagemAtualizado.higiene < 4){
        throw new Error("Seu personagem precisa tomar banho para trabalhar");
    }

    
    const HIGIENE_GASTA = 4
    const ENERGIA_GASTA = 10
    const TEMPO_TRABALHO = 20000
    const DESCONTO_SALARIO_HIGIENE = 0.90
    
    if(personagemAtualizado.higiene - HIGIENE_GASTA < 4){
        salarioDiario = salarioDiario * DESCONTO_SALARIO_HIGIENE
    }


    //CÁLCULO SALÁRIO COM AJUSTES
    const ENERGIA_ATUAL = personagemAtualizado.energia
    const ENERGIA_MINIMA = 2
    const ENERGIA_PARA_DESCONTO = 5
    const ENERGIA_PARA_RECALCULO = 3
    const PORCENTAGEM_DESCONTO = 0.10
    

    const TEMPO_TRABALHO_POR_ENERGIA = TEMPO_TRABALHO/ENERGIA_GASTA
    const ENERGIA_PARA_GASTAR = ENERGIA_ATUAL - ENERGIA_MINIMA
    const TEMPO_PARA_TRABALHAR = ENERGIA_PARA_GASTAR * TEMPO_TRABALHO_POR_ENERGIA
    const TEMPO_PARA_CADA_CRESCELEON = TEMPO_TRABALHO/salarioDiario
    const CRESCELEON_PARA_CADA_PONTO_ENERGIA = TEMPO_TRABALHO_POR_ENERGIA/TEMPO_PARA_CADA_CRESCELEON


    const RECALCULO_SALARIO_CRESCIM_CANSADO = ENERGIA_PARA_RECALCULO * (CRESCELEON_PARA_CADA_PONTO_ENERGIA - (CRESCELEON_PARA_CADA_PONTO_ENERGIA * PORCENTAGEM_DESCONTO))
    const ENERGIA_CRESCIM_DESCANSADO = ENERGIA_ATUAL - ENERGIA_PARA_DESCONTO
    const SALARIO_CRESCIM_DESCANSADO = ENERGIA_CRESCIM_DESCANSADO * CRESCELEON_PARA_CADA_PONTO_ENERGIA

    const salarioTotal = RECALCULO_SALARIO_CRESCIM_CANSADO + SALARIO_CRESCIM_DESCANSADO
    //FIM CÁLCULO SALÁRIO

    //CÁLCULO DE GASTO DE HIGIENE POR ENERGIA
    const HIGIENE_GASTA_POR_ENERGIA = HIGIENE_GASTA/ENERGIA_GASTA
    //

    if (personagemAtualizado.energia <= 10) {
        const higieneGasta = HIGIENE_GASTA_POR_ENERGIA * ENERGIA_PARA_GASTAR

        personagemAtualizado.cresceleons += salarioTotal
        personagemAtualizado.energia -= ENERGIA_PARA_GASTAR
        personagemAtualizado.vida -= TEMPO_PARA_TRABALHAR
        personagemAtualizado.higiene -= higieneGasta

        atualizaPersonagem(personagemAtualizado)
        return personagemAtualizado
    }

    if (personagemAtualizado.energia == 11) {
        const ENERGIA_PARA_TRABALHAR = 9
        const higieneGasta = HIGIENE_GASTA_POR_ENERGIA * ENERGIA_PARA_TRABALHAR

        const TEMPO_PARA_TRABALHAR_COM_ENERGIA_ONZE = ENERGIA_PARA_TRABALHAR * TEMPO_TRABALHO_POR_ENERGIA
        const salarioAReceber = CRESCELEON_PARA_CADA_PONTO_ENERGIA * ENERGIA_PARA_TRABALHAR
        personagemAtualizado.energia = 2
        personagemAtualizado.cresceleons += salarioAReceber
        personagemAtualizado.vida -= TEMPO_PARA_TRABALHAR_COM_ENERGIA_ONZE
        personagemAtualizado.higiene -= higieneGasta

        atualizaPersonagem(personagemAtualizado)
        return personagemAtualizado
    }

    personagemAtualizado.energia -= ENERGIA_GASTA
    personagemAtualizado.vida -= TEMPO_TRABALHO
    personagemAtualizado.cresceleons += salarioDiario
    personagemAtualizado.higiene -= HIGIENE_GASTA

    atualizaPersonagem(personagemAtualizado)
    return personagemAtualizado
}

export function tomarBanho(idPersonagem){
    const personagemAtualizado = buscaPersonagem(idPersonagem)
    personagemAtualizado.cresceleons -= 10
    personagemAtualizado.higiene = 28

    atualizaPersonagem(personagemAtualizado)
    return personagemAtualizado
}

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