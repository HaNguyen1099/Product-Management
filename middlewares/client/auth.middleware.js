
module.exports.requireAuth = (req, res, next) => {
  if (!res.locals.user) {
    req.flash("error", "Vui lòng đăng nhập để thực hiện chức năng này!");
    res.redirect("back");
    return;
  }

  next();
};