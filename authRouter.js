import { Router } from 'express';
import controller from './authController.js';
import { check } from 'express-validator';
import authMiddleware from './middlewaree/authMiddleware.js';
const router = new Router();

router.post(
  '/registration',
  [
    check('username', 'Имя пользователя не может быть пустым.').notEmpty(),
    check('password', 'Пароль не может быть меньше 4 и больше 30 символов').isLength({
      min: 4,
      max: 30,
    }),
  ],
  controller.registration,
);
router.post('/login', controller.login);
router.post('/addNote', authMiddleware, controller.addNote);
router.put('/updateNote', authMiddleware, controller.updateNote);
router.get('/getNote', authMiddleware, controller.getNote);
router.delete('/delete', authMiddleware, controller.deleteNote);

export default router;
