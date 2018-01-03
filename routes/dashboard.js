const express = require('express');
const firebaseDb = require('../models/firebase_connect');

const router = express.Router();
const categoriesPath = '/categories/';
const categoriesRef = firebaseDb.ref(categoriesPath);

router.get('/', (req, res) => {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/post/create', (req, res) => {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/categories', (req, res) => {
  const messages = req.flash('error');
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    res.render('dashboard/categories', {
      title: 'Express',
      categories,
      messages,
      hasErrors: messages.length > 0,
    });
  });
});

router.get('/tags', (req, res) => {
  res.render('dashboard/tags', { title: 'Express' });
});

// Post
router.post('/categories/create', (req, res) => {
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  const data = req.body;
  data.id = key;
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
    .then((snapshot) => {
      console.log('create', snapshot.val());
      if (snapshot.val() !== null) {
        req.flash('error', '已有相同的路徑');
        res.redirect('/dashboard/categories');
      } else {
        // 如果沒有這個值，才能技術儲存
        categoryRef.set(data).then(() => {
          res.redirect('/dashboard/categories');
        });
      }
    });
});

// Delete
router.post('/categories/delete/:id', (req, res) => {
  const data = req.body;
  const id = req.param('id');
  categoriesRef.child(id).remove();
  req.flash('error', '欄位已經被刪除');
  res.redirect('/dashboard/categories');
  res.end();
});

module.exports = router;
