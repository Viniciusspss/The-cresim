import { atualizaPersonagem, buscaPersonagem } from "./personagem";

export function dormir(personagemId, tempo){
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
      pontosEnergia += BONUS_ENERGIA
    }

    personagem.energia += pontosEnergia

    atualizaPersonagem(personagem)
    return personagem
}