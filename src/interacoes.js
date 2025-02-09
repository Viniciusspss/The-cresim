import { atualizaPersonagem } from "./personagem"

export function dormir (personagem, tempo){
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

    personagem.energia += pontosEnergia

    atualizaPersonagem(personagem)

}


export function trabalhar (personagem ,empregos, idEmprego){
    const ENERGIA_GASTA = 10
    const TEMPO_TRABALHO = 20000

    const emprego = empregos.find(emp => emp.id === idEmprego)
    const salarioJunior = emprego.salario.find(s => s.nivel === "JUNIOR").valor

    if(personagem.energia <= 4){
        console.log("Seu personagem está muito cansado e não pode trabalhar!")
        return 
    }
    
    if (personagem.energia <= 10) {
        
    }

    personagem.energia -= ENERGIA_GASTA
    personagem.vida -= TEMPO_TRABALHO


}
