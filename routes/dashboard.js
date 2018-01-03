const express = require('express');
const firebaseDb = require('../models/firebase_connect');

const router = express.Router();
const categoriesPath = '/categories/';
const categoriesRef = firebaseDb.ref(categoriesPath);

router.get('/', (req, res) => {
  res.render('dashboard/archives', { title: 'Express' });
  console.log(db);
});

router.get('/post/create', (req, res) => {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/categories', (req, res) => {
  res.render('dashboard/categories', { title: 'Express' });
});

router.get('/tags', (req, res) => {
  res.render('dashboard/tags', { title: 'Express' });
});

// Post
router.post('/categories/create', (req, res) => {
  let data = req.body;
  let key = categoriesRef.push().key();
});


module.exports = router;
