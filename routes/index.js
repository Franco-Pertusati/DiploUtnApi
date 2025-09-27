var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/info', function(req, res) {
  res.json({
    message: `Se ha solicitado la ruta de información en el día: ${new Date().toLocaleString()}`
  });
});

router.get('/captcha', function(req, res) {
  res.send(`
    <html>
      <head>
        <title>Captcha</title>
      </head>
      <body>
        <h1>Captcha</h1>
        <img src="data:image/png;base64,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" alt="" />
        <form method="POST" action="/catcha">
          <label for="captcha">Ingrese el texto:</label>
          <input type="text" />
          <button type="submit">Enviar</button>
        </form>
      </body>
    </html>
  `);
});

router.get('/es-par/:numero', function(req, res) {
  const numero = parseInt(req.params.numero, 10);

  if (isNaN(numero)) {
    return res.status(400).json({ error: 'El parametro debe ser un número' });
  }

  const esPar = numero % 2 === 0;

  res.json({
    numero: numero,
    esPar: esPar
  });
});


module.exports = router;
