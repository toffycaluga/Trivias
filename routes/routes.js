import express from 'express';
import fs from 'fs/promises';
import { get_random_questions, create_question, insert_games, get_games } from "../db.js";
import score from '../utils/score.js'
import formatDate from '../utils/formarDate.js'


const router = express.Router()

function protected_route(req, res, next) {
  if (!req.session.user) {
    // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
    return res.redirect('/login')
  }
  next()
}

// RUTAS
router.get('/', protected_route, async (req, res) => {
  const games = await get_games();
  await formatDate(games)

  const mensajes = req.flash('mensaje')


  res.render('index.html', { mensajes, games })
})

router.get('/new_question', protected_route, async (req, res) => {

  res.render('new_question.html',)
})
router.get('/lets_play', protected_route, async (rec, res) => {
  const preguntas = await get_random_questions()
  preguntas.map(pregunta => {
    const respuestas = [pregunta.correct, pregunta.fake_1, pregunta.fake_2]
    pregunta.respuestas = respuestas.sort((a, b) => 0.5 - Math.random())
  })

  res.render('lets_play.html', { preguntas })
})


router.post('/lets_play/:user_id/', protected_route, async (req, res) => {
  const nscore = await score(req.body);
  console.log(nscore);
  await insert_games(req.params.user_id, nscore.score)
  req.flash('mensaje', `has logrado ${nscore.score}/3 (${nscore.porcentaje}%) `)
  res.redirect('/',)
})




router.post('/new_question', async (req, res) => {
  await create_question(req.body);
  res.redirect('/new_question')
});
export default router
