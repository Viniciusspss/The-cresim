import axios from 'axios'

export async function getDados(url) {
    const dados = await axios.get(url);
    return dados.data;
}