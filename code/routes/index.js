import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  getAllAccounts,
  getSingleAccount,
  makeNewAccount,
} from '../controllers/accountsController.js';
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// routes
router.get('/', (req, res, next) => {
  res.json('Hi, this is the accounts microservice');
});
router.post('/', cors(), makeNewAccount);

//router.post('/', cors(), (req, res) => {
//  res.send('POST request to the accounts microservice')
//});

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
router.get('/accounts/:id', cors(), getSingleAccount);
//router.post('/accounts', cors(), setAccounts);

export default router;
