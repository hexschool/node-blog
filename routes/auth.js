const express = require('express');
const firebase = require('../connections/firebase_connect');

const router = express.Router();

router.get('/signup', (req, res) => {
  const messages = req.flash('error');
  res.render('dashboard/signup', {
    messages,
    hasErrors: messages.length > 0,
  });
});

router.get('/signin', (req, res) => {
  const messages = req.flash('error');
  res.render('dashboard/signin', {
    messages,
    hasErrors: messages.length > 0,
  });
});

router.get('/signout', (req, res) => {
  req.session.uid = '';
  res.redirect('/auth/signin');
});

router.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;
  if (password !== confirmPassword) {
    req.flash('error', '兩個密碼輸入不符合');
    res.redirect('/auth/signup');
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log(req.session.uid);
      res.redirect('/auth/signin');
    })
    .catch((error) => {
      console.log(error);
      req.flash('error', error.message);
      res.redirect('/auth/signup');
    });
});

router.post('/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      req.session.uid = user.uid;
      req.session.mail = req.body.email;
      console.log(req.session.uid);
      res.redirect('/dashboard');
    })
    .catch((error) => {
      console.log(error);
      req.flash('error', error.message);
      res.redirect('/auth/signin');
    });
});

module.exports = router;
