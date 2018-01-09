const express = require('express');
const moment = require('moment');
const firebase = require('firebase');
const firebaseDb = require('../models/firebase_admin_connect');

const router = express.Router();
const categoriesPath = '/categories/';
const categoriesRef = firebaseDb.ref(categoriesPath);
const articlesPath = '/articles/';
const articlesRef = firebaseDb.ref(articlesPath);

/* GET home page. */
router.get('/', (req, res) => {
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('status').equalTo('public').once('value');
  }).then((snapshot) => {
    const articles = snapshot.val();
    res.render('archives', {
      title: 'Express',
      categoryId: null,
      articles,
      categories,
      moment, // 時間套件
    });
  });
});

router.get('/archives/:category', (req, res) => {
  const categoryId = req.param('category');
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('category').equalTo(categoryId).once('value');
  }).then((snapshot) => {
    const articles = snapshot.val();
    res.render('archives', {
      title: 'Express',
      articles,
      categories,
      categoryId,
      moment, // 時間套件
    });
  });
});

router.get('/post/:id', (req, res) => {
  const id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then((snapshot) => {
    const article = snapshot.val();
    res.render('post', {
      title: 'Express',
      categoryId: null,
      article,
      categories,
      moment, // 時間套件
    });
  });
});

module.exports = router;
