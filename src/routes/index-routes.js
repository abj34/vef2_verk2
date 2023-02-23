import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { listEvent, listEvents, listRegistered, register, removeRegistration } from '../lib/db.js';
import { findByUsername, userInEvent } from '../lib/users.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware
} from '../lib/validation.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const events = await listEvents();
  const userInfo = {id: null, user: null};

  console.log('indexRoute - index')

  res.render('index', {
    title: 'Viðburðasíðan',
    admin: false,
    events,
    userInfo,
  });
}

async function eventRoute(req, res, next) {
  const { slug } = req.params;
  const event = await listEvent(slug);

  if (!event) {
    return next();
  }

  const registered = await listRegistered(event.id);
  const { user: { username } = {} } = req || {};
  const userInfo = await findByUsername(username);
  const userExists = await userInEvent(userInfo.name, event.id);
  console.log(userExists);

  console.log('Event route - index');

  return res.render('event', {
    title: `${event.name} — Viðburðasíðan`,
    event,
    registered,
    errors: [],
    data: {},
    username,
    userInfo,
    userExists,
  });
}

async function eventRegisteredRoute(req, res) {
  const events = await listEvents();

  console.log('Event registeredroute - index')

  res.render('registered', {
    title: 'Viðburðasíðan',
    events,
  });
}

async function validationCheck(req, res, next) {
  const { name, comment } = req.body;

  // TODO tvítekning frá því að ofan
  const { slug } = req.params;
  const event = await listEvent(slug);
  const registered = await listRegistered(event.id);

  console.log('validation check - index')

  const data = {
    name,
    comment,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.render('event', {
      title: `${event.name} — Viðburðasíðan`,
      data,
      event,
      registered,
      errors: validation.errors,
    });
  }

  return next();
}

async function registerRoute(req, res) {
  const { name, comment } = req.body;
  const { slug } = req.params;
  const event = await listEvent(slug);

  console.log('register route - index')

  const userExists = await userInEvent(name, event.id);

  if(!userExists) {
    const registered = await register({
      name,
      comment,
      event: event.id,
    });

    if (registered) {
      return res.redirect(`/${event.slug}`);
    }
  } else {
    removeRegistration(name, event.id);
    return res.redirect(`/${event.slug}`);
  }


  return res.render('error');
}

indexRouter.get('/', catchErrors(indexRoute));
indexRouter.get('/:slug', catchErrors(eventRoute));
indexRouter.post(
  '/:slug',
  registrationValidationMiddleware('comment'),
  xssSanitizationMiddleware('comment'),
  catchErrors(validationCheck),
  sanitizationMiddleware('comment'),
  catchErrors(registerRoute)
);
indexRouter.get('/:slug/thanks', catchErrors(eventRegisteredRoute));
