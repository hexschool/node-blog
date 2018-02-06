module.exports = (res, title) => {
  res.render('error', {
    title,
  });
};
