const express = require('express');
const moment = require('moment');
const striptags = require('striptags');
const firebaseDb = require('../connections/firebase_admin_connect');
const convertPagination = require('../modules/pagination');
const firebaseSort = require('../modules/firebaseSort');

const router = express.Router();
const categoriesPath = '/categories/';
const categoriesRef = firebaseDb.ref(categoriesPath);
const articlesPath = '/articles/';
const articlesRef = firebaseDb.ref(articlesPath);

/* GET home page. */
router.get('/', (req, res) => {
  const currentPage = Number.parseInt(req.query.page, 10) || 1;
  let categories = {};

  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    const sortData = firebaseSort.byDate(snapshot, 'status', 'public');
    const articles = convertPagination(sortData, currentPage);
    res.render('archives', {
      title: 'Express',
      categoryId: null,
      articles: articles.data,
      pagination: articles.page,
      categories,
      striptags, // 去除 HTML 標籤套件
      moment, // 時間套件
    });
  });
});

router.get('/archives/:category', (req, res) => {
  const currentPage = Number.parseInt(req.query.page, 10) || 1;
  const categoryPath = req.param('category');
  let categories = {};
  let categoryId = '';
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().path === categoryPath) {
        categoryId = childSnapshot.val().id;
      }
    });
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    const sortData = firebaseSort.byDate(snapshot, 'category', categoryId);
    const articles = convertPagination(sortData, currentPage, `archives/${categoryPath}`);
    res.render('archives', {
      title: 'Express',
      categories,
      categoryId,
      articles: articles.data,
      pagination: articles.page,
      striptags, // 去除 HTML 標籤套件
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
