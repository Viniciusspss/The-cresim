import { atualizaPersonagem, buscaPersonagem } from "./personagem.js"

export function dormir (personagemId, tempo){
    const personagem = buscaPersonagem(personagemId)

    const TEMPO_INVALIDO = 0;
    if(tempo < TEMPO_INVALIDO){
        throw new Error('Insira um tempo válido.')
    }

    const INTERVALO_SONO = 5
    const ENERGIA_POR_INTERVALO = 4
    const BONUS_ENERGIA = 2
    const tempoDormido = tempo/INTERVALO_SONO
    let pontosEnergia = tempoDormido*ENERGIA_POR_INTERVALO
    for (let i = 1; i < tempoDormido; i++) {
        pontosEnergia+=BONUS_ENERGIA
    }

    personagem.energia += pontosEnergia

    atualizaPersonagem(personagem)
    return personagem
}


export function trabalhar (personagemId, empregos, idEmprego){
    const personagem = buscaPersonagem(personagemId)
    const emprego = empregos.find(emp => emp.id === idEmprego)

    const nivelHabilidade = personagem.habilidades[emprego.categoria].nivel
    const salarioDiario = emprego.salario.find(s => s.nivel === nivelHabilidade).valor

    if(personagem.energia <= 4){
        console.log("Seu personagem está muito cansado e não pode trabalhar!")
        return null
    }

    const ENERGIA_GASTA = 10
    const TEMPO_TRABALHO = 20000

    //CÁLCULO SALÁRIO COM AJUSTES
    const ENERGIA_ATUAL = personagem.energia
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

    if (personagem.energia <= 10) {

        personagem.cresceleons += salarioTotal
        personagem.energia -= ENERGIA_PARA_GASTAR
        personagem.vida -= TEMPO_PARA_TRABALHAR

        atualizaPersonagem(personagem)
        return personagem
    }

    if (personagem.energia == 11) {
        const ENERGIA_PARA_TRABALHAR = 9
        const TEMPO_PARA_TRABALHAR_COM_ENERGIA_ONZE = ENERGIA_PARA_TRABALHAR * TEMPO_TRABALHO_POR_ENERGIA
        const salarioAReceber = CRESCELEON_PARA_CADA_PONTO_ENERGIA * ENERGIA_PARA_TRABALHAR
        personagem.energia = 2
        personagem.cresceleons += salarioAReceber
        personagem.vida -= TEMPO_PARA_TRABALHAR_COM_ENERGIA_ONZE

        atualizaPersonagem(personagem)
        return personagem
    }

    personagem.energia -= ENERGIA_GASTA
    personagem.vida -= TEMPO_TRABALHO
    personagem.cresceleons += salarioDiario

    atualizaPersonagem(personagem)
    return personagem
}
