exports.getError404 = (req, res, next) => {
  res.status(404).render('error404',{
    pageTitle: 'Page Not Found',
    path: '/error404'
  });
};

exports.getError500 = (req,res, next) => {
  res.status(500).render('error500',{
    pageTitle: 'Application Error',
    path: '/error500'
  });
};