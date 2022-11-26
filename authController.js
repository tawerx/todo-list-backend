import User from './models/User.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from './config.js';
import NewNotes from './models/NewNotes.js';

const generateAccesToken = (id) => {
  const payload = {
    id,
  };

  return jwt.sign(payload, secret.secret, { expiresIn: '1h' });
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.log(e);
  }
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Ошибка при регистрации.' });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже создан.' });
      }
      const hashPassword = bcrypt.hashSync(password, 5);
      const user = await User.create({ username, password: hashPassword });
      return res.json({ message: 'Пользователь успешно зарегистрирован!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Registration error' });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `Пользователь ${username} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Введен неверный пароль.' });
      }
      const token = generateAccesToken(user._id);
      return res.json(token);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async addNote(req, res) {
    try {
      const { title, description, date, dateCreate, files, complete, delay } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      const { id } = parseJwt(token);
      const user = await User.findOne({ _id: id });
      const note = await NewNotes.create({
        title,
        description,
        date,
        dateCreate,
        files,
        complete,
        delay,
        user,
      });
      res.status(200).json({
        message: 'Запись успешно добавлена!',
        noteRes: { _id: note._id, title, description, date, dateCreate, files, complete, delay },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Ошибка добавления записи' });
    }
  }
  async getNote(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id } = parseJwt(token);
      const { _id } = await User.findOne({ _id: id });
      const notes = await NewNotes.find({ user: _id });
      res.json(
        notes.map((obj, i) => {
          return {
            _id: obj._id,
            title: obj.title,
            description: obj.description,
            date: obj.date,
            dateCreate: obj.dateCreate,
            files: obj.files,
            complete: obj.complete,
            delay: obj.delay,
          };
        }),
      );
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'getNote error' });
    }
  }

  async deleteNote(req, res) {
    try {
      const { deleteId } = req.body;
      await NewNotes.deleteOne({ _id: deleteId });
      res.json({ message: 'Запись удалена' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Delete error' });
    }
  }

  async updateNote(req, res) {
    try {
      const { _id, obj } = req.body;
      const note = await NewNotes.findByIdAndUpdate(_id, obj);
      res.status(200).json({ message: 'Note updated', note });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Update error' });
    }
  }
}

export default new authController();
