const express = require('express')
const fs = require('fs').promises


const router = express.Router()

function protected_route (req, res, next) {
  if (!req.session.user) {
    // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
    return res.redirect('/login')
  }
  next()
}

// RUTAS
router.get('/', protected_route, (req, res) => {
  res.render('index.html')
})

router.get('/seguidos', protected_route, async (req, res) => {
  const images = await fs.readdir('static')
  res.render('seguidos.html', { images })
})

router.post('/images', async (req, res) => {

  const image = req.files.image
  const extension = image.name.split('.')[1]

  const file_name = `${req.body.name}.${extension}`

  await image.mv(`static/${file_name}`)

  res.redirect('/')
});

module.exports = router
