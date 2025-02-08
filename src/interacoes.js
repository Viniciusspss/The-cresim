import { atualizaPersonagem } from "./personagem"

export function dormir (personagem, tempo){
    if(tempo < 0){
        console.log("Insira um tempo válido")
    }
    const tempoDormido = tempo/5
    let pontosEnergia = tempoDormido*4
    for (let i = 1; i < tempoDormido; i++) {
        pontosEnergia+=2
    }

    personagem.energia += pontosEnergia

    atualizaPersonagem(personagem)

}