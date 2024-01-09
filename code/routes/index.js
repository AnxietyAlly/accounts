import express from 'express';
import cors from 'cors';
import {
  getAllAccounts,
  getSingleAccount,
  makeNewAccount,
  updateAccount,
  getSingleAccountBasedOnEmail
} from '../controllers/accountsController.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('Hi, this is the accounts microservice');
});

router.options('/accounts', (req, res, next) => {
  try {
    //set header before response
    res.header({
      allow: 'GET, POST, OPTIONS',
      'Content-type': 'application/json',
      Data: Date.now(),
      'Content-length': 0,
    });
    //response
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// get a collection of all the accounts, you can also use a query
router.get('/accounts', cors(), getAllAccounts);
router.get('/accounts/id/:id', cors(), getSingleAccount);
router.get('/accounts/email/:email', cors(), getSingleAccountBasedOnEmail);
router.post('/accounts', cors(), makeNewAccount);
router.post('/accounts/update/name/:name/newEmail/:newEmail/password/:password/oldEmail/:oldEmail', cors(), updateAccount);

export default router;
