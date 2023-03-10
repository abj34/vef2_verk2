import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import {
  createEvent, eventAmount, listEvent,
  listEventByName, listEvents, removeEvent, updateEvent
} from '../lib/db.js';
import { ensureLoggedIn } from '../lib/login.js';
import { slugify } from '../lib/slugify.js';
import { findByUsername } from '../lib/users.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware
} from '../lib/validation.js';

export const adminRouter = express.Router();

export const page = { pagenumber: 0,  pageamount: 0, pageincrement: 10};

async function index(req, res) {
  const events = await listEvents(page.pagenumber, page.pageincrement);
  const pageamount = await eventAmount();
  page.pageamount = Math.ceil(Number(pageamount) / page.pageincrement);

  const { user: { username } = {} } = req || {};
  const userInfo = await findByUsername(username);

  return res.render('admin', {
    username,
    userInfo,
    events,
    errors: [],
    data: {},
    title: 'Viðburðir — skráður inn notandi',
    admin: true,
  });
}

async function validationCheck(req, res, next) {
  const { name, description, location, url } = req.body;

  const events = await listEvents();
  const { user: { username } = {} } = req || {};

  const data = {
    name,
    description,
    location,
    url,
  };

  const validation = validationResult(req);

  const customValidations = [];

  const eventNameExists = await listEventByName(name);

  if (eventNameExists !== null) {
    customValidations.push({
      param: 'name',
      msg: 'Viðburður með þessu nafni er til',
    });
  }

  if (!validation.isEmpty() || customValidations.length > 0) {
    return res.render('admin', {
      events,
      username,
      title: 'Viðburðir — umsjón',
      data,
      errors: validation.errors.concat(customValidations),
      admin: true,
    });
  }

  return next();
}

async function validationCheckUpdate(req, res, next) {
  const { name, description, location, url } = req.body;
  const { slug } = req.params;
  const { user: { username } = {} } = req;

  const event = await listEvent(slug);

  const data = {
    name,
    description,
    location,
    url,
  };

  const validation = validationResult(req);

  const customValidations = [];

  const eventNameExists = await listEventByName(name);

  if (eventNameExists !== null && eventNameExists.id !== event.id) {
    customValidations.push({
      param: 'name',
      msg: 'Viðburður með þessu nafni er til',
    });
  }

  if (!validation.isEmpty() || customValidations.length > 0) {
    return res.render('admin-event', {
      username,
      event,
      title: 'Viðburðir — umsjón',
      data,
      errors: validation.errors.concat(customValidations),
      admin: true,
    });
  }

  return next();
}

async function registerRoute(req, res) {
  const { name, description, location, url } = req.body;
  const slug = slugify(name);

  const { user: { username } = {} } = req;
  const userInfo = await findByUsername(username);
  const owner = userInfo.id

  const created = await createEvent({ name, slug, description, location, url, owner });

  if (created) {
    return res.redirect('/admin');
  }

  return res.render('error');
}

async function updateRoute(req, res) {
  const { name, description, location, url } = req.body;
  const { slug } = req.params;

  const event = await listEvent(slug);

  const newSlug = slugify(name);

  const updated = await updateEvent(event.id, {
    name,
    slug: newSlug,
    description,
    location,
    url,
  });

  if (updated) {
    return res.redirect('/admin');
  }

  return res.render('error');
}

async function eventRoute(req, res, next) {
  const { slug } = req.params;
  const { user: { username } = {} } = req;

  const event = await listEvent(slug);

  if (!event) {
    return next();
  }

  return res.render('admin-event', {
    username,
    title: `${event.name} — Viðburðir — umsjón`,
    event,
    errors: [],
    data: {
      name: event.name,
      description: event.description,
      location: event.location,
      url: event.url
    },
  });
}

async function EventRemove(req,res) {
  const {slug } = req.params;
  const slugEvent = await listEvent(slug);
  removeEvent(slugEvent.id);

  return res.redirect('/admin');
}

adminRouter.get('/', ensureLoggedIn, catchErrors(index));
adminRouter.post(
  '/',
  ensureLoggedIn,
  registrationValidationMiddleware('description'),
  xssSanitizationMiddleware('description'),
  catchErrors(validationCheck),
  sanitizationMiddleware('description'),
  catchErrors(registerRoute)
);

adminRouter.get('/previouspage', (req, res) => {
  // Hleður niður fyrri bls
  if(page.pagenumber !== 0) {
    page.pagenumber = Number(page.pagenumber) - page.pageincrement
  }
  res.redirect('/admin');
});
adminRouter.get('/nextpage', (req, res) => {
  // Hleður niður næstu bls
  if( page.pageamount !== Math.ceil((page.pagenumber+1) / page.pageincrement) ) {
    page.pagenumber = Number(page.pagenumber) + page.pageincrement
  }
  res.redirect('/admin');
  });

adminRouter.get(
  '/remove/:slug',
  ensureLoggedIn,
  catchErrors(EventRemove)
);

// Verður að vera seinast svo það taki ekki yfir önnur route
adminRouter.get('/:slug', ensureLoggedIn, catchErrors(eventRoute));
adminRouter.post(
  '/:slug',
  ensureLoggedIn,
  registrationValidationMiddleware('description'),
  xssSanitizationMiddleware('description'),
  catchErrors(validationCheckUpdate),
  sanitizationMiddleware('description'),
  catchErrors(updateRoute)
);
