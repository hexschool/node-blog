const express = require('express');
const moment = require('moment');
const striptags = require('striptags');
const firebaseDb = require('../models/firebase_admin_connect');
const convertPagination = require('../modules/pagination');

const router = express.Router();
const categoriesPath = '/categories/';
const categoriesRef = firebaseDb.ref(categoriesPath);
const articlesPath = '/articles/';
const articlesRef = firebaseDb.ref(articlesPath);
const tagsPath = '/tags/';
const tagsRef = firebaseDb.ref(tagsPath);

router.get('/', (req, res) => {
  const messages = req.flash('error');
  res.render('dashboard/index', {
    title: 'Express',
    currentPath: '/',
    hasErrors: messages.length > 0,
  });
});

router.get('/archives/:state', (req, res) => {
  const messages = req.flash('error');
  const state = req.param('state') || 'public';
  const currentPage = Number.parseInt(req.query.page, 10) || 1;
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('status').equalTo(state).once('value');
  }).then((snapshot) => {
    // const articles = snapshot.val();
    const articles = convertPagination(snapshot, currentPage, `dashboard/archives/${state}`);
    res.render('dashboard/archives', {
      title: 'Express',
      articles: articles.data,
      pagination: articles.page,
      currentPath: '/archives/',
      messages,
      categories,
      state,
      moment, // 時間套件
      striptags,
      hasErrors: messages.length > 0,
    });
  });
});

router.get('/article/create', (req, res) => {
  const messages = req.flash('error');
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    res.render('dashboard/article', {
      title: 'Express',
      currentPath: '/article/create',
      categories,
      messages,
      hasErrors: messages.length > 0,
    });
  });
});

router.get('/article/:id', (req, res) => {
  const messages = req.flash('error');
  const id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then((snapshot) => {
    const article = snapshot.val();
    res.render('dashboard/article', {
      title: 'Express',
      currentPath: '/article/',
      article,
      messages,
      categories,
      hasErrors: messages.length > 0,
    });
  });
});

router.get('/categories', (req, res) => {
  const messages = req.flash('error');
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    res.render('dashboard/categories', {
      title: 'Express',
      currentPath: '/categories/',
      categories,
      messages,
      hasErrors: messages.length > 0,
    });
  });
});

router.get('/tags', (req, res) => {
  res.render('dashboard/tags', { title: 'Express' });
});

// === 文章管理 ===
// Post
router.post('/article/create', (req, res) => {
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() / 1000);
  const data = req.body;
  data.id = key;
  data.update_time = updateTime;
  articleRef.set(data).then(() => {
    res.redirect(`/dashboard/article/${key}`);
  });
});

router.post('/article/update/:id', (req, res) => {
  const data = req.body;
  const id = req.param('id');
  articlesRef.child(id).set(data).then(() => {
    res.redirect(`/dashboard/article/${data.id}`);
  });
});

router.delete('/article/:id', (req, res) => {
  const id = req.param('id');
  articlesRef.child(id).remove().then(() => {
    res.send({
      success: true,
      url: '/dashboard/archives/public',
    });
    res.end();
  });
});

// === 標籤管理 ===
// Post
router.post('/api/tag/create', (req, res) => {
  const tagRef = tagsRef.push();
  // const key = tagRef.key;
  const data = req.body;
  tagsRef.orderByChild('name').equalTo(data.name).once('value')
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        res.send({
          success: false,
          message: '已有相同的值',
        });
        res.end();
      } else {
        // 如果沒有這個值，才能技術儲存
        tagRef.set(data).then((response) => {
          res.send({
            success: true,
            data: response,
          });
          res.end();
        });
      }
    });
});

router.get('/api/tags', (req, res) => {
  tagsRef.once('value').then((snapshot) => {
    const tags = snapshot.val();
    res.send({
      success: true,
      data: tags,
    });
    res.end();
  });
});

// === 分類管理 ===
// Post
router.post('/categories/create', (req, res) => {
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  const data = req.body;
  data.id = key;
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        req.flash('error', '已有相同的路徑');
        res.redirect('/dashboard/categories');
      } else {
        // 如果沒有這個值，才能儲存
        categoryRef.set(data).then(() => {
          res.redirect('/dashboard/categories');
        });
      }
    });
});

// Delete
router.post('/categories/delete/:id', (req, res) => {
  const id = req.param('id');
  categoriesRef.child(id).remove();
  req.flash('error', '欄位已經被刪除');
  res.redirect('/dashboard/categories');
  res.end();
});

module.exports = router;
