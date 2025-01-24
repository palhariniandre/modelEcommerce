const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controllers/UsuarioController');

const Usuario = new UsuarioController();

router.get('/', auth.required, Usuario.index);
router.get('/:id', auth.required, Usuario.show);

router.post('/login', Usuario.login);
router.post('/registrar', Usuario.store);
router.put('/', auth.required, Usuario.update);
router.delete('/', auth.required, Usuario.remove);

router.get('/recuperar-senha', Usuario.showRecovery);
router.post('/recuperar-senha', Usuario.createRecovery);
router.get('/senha-recuperada', Usuario.showCompleteRecovery);
router.post('/senha-recuperada', Usuario.completeRecovery);

module.exports = router;