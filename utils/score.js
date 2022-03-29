import { consulta_respuesta } from "../db.js";


export default async function score(resp) {
    const respuestas = Object.values(resp)
    let score = 0
    for (let i = 0; i < 3; i++) {
        const validacion = await consulta_respuesta(respuestas[i])
        score += validacion.length;
    }
    const porcentaje = Math.round(score * 100 / 3)
    return { score: score, porcentaje: porcentaje }
}