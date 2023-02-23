import express from 'express';
import passport from '../lib/login.js';

import {
  createUser, findByUsername
} from '../lib/users.js';

export const userRouter = express.Router();

function login(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('login', { message, title: 'Innskráning' });
}

async function validateUser(name, username, password) {
  if (typeof name !== 'string' || name.length < 2) {
    return 'Nafn þarf að vera amk 2 stafir';
  }

  if (typeof username !== 'string' || username.length < 2) {
    return 'Notendanafn verður að vera amk 2 stafir';
  }

  const user = await findByUsername(username);

  // Villa frá findByUsername
  if (user === null) {
    return 'Gat ekki athugað notendanafn';
  }

  if (user) {
    return 'Notendanafn er þegar skráð';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Lykilorð verður að vera amk 6 stafir';
  }

  return null;
}

async function register(req, res, next) {
  const { name, username, password } = req.body;

  const validationMessage = await validateUser(name, username, password);

  if (validationMessage) {
    return res.send(`
      <p>${validationMessage}</p>
      <a href="/register">Reyna aftur</a>
    `);
  }

  await createUser(name, username, password);

  // næsta middleware mun sjá um að skrá notanda inn
  // `username` og `password` verða ennþá sett sem rétt í `req`
  return next();
}

userRouter.get('/login', login);
userRouter.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /user
  (req, res) => {
    res.redirect('/admin');
  }
);

userRouter.get('/logout', (req, res) => {
  // logout hendir session cookie og session
  req.logout();
  res.redirect('/');
});

userRouter.get('/register', (req, res) => {
  res.render('register', { title: 'Nýskráning' })
});

userRouter.post(
  '/register',
  register,
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/register',
  }),
    (req, res) => {
    console.log(req.body);
    res.redirect('/admin');
});
