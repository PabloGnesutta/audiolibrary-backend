const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');

if (process.env.SIGNUP_FLAG === 'enabled') {
  router.post('/user', authController.signUp);
  console.log('* - signup enabled');
} else console.log(' - signup disabled');

router.post('/confirmar-email', authController.verifyEmail);
router.post('/sesion', authController.login);
router.get('/sesion', authController.verifySession);
router.post('/refresh-access-token', authController.refreshAccessToken);

module.exports = router;
