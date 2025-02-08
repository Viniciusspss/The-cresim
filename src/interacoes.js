export async function dormir (personagem, tempo){
    const tempoDormido = tempo/5
    let pontosEnergia = tempoDormido*4
    for (let i = 1; i < tempoDormido; i++) {
        pontosEnergia+=2
    }

    personagem.energia += pontosEnergia
    
    if (personagem.energia > 32) {
        personagem.energia = 32
    }
}