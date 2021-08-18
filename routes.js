const passport = require("passport");
const bcrypt = require("bcrypt");
module.exports = function (app, myDataBase) {
  // Be sure to change the title
  app.route("/").get((req, res) => {
    // Change the response to render the Pug template
    const ObjValues = {
      title: "Connected to Database",
      message: "Please login",
      showLogin: true,
      showRegistration: true,
    };
    res.render("pug/index", ObjValues);
  });

  app
    .route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("pug/profile");
      },
    );

  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + "/views/pug/profile", {
      username: req.user.username,
    });
  });
  app.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/");
  });
  app.route("/auth/github").get(passport.authenticate("github"), (req, res) => {
    res.redirect("/");
  });

  app
    .route("/auth/github/callback")
    .get(
      passport.authenticate("github", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/profile");
      },
    );

  app.route("/register").post(
    (req, res, next) => {
      const hash = bcrypt.hashSync(req.body.password, 12);
      myDataBase.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect("/");
        } else {
          myDataBase.insertOne(
            { username: req.body.username, password: hash },
            (err, doc) => {
              if (err) {
                res.redirect("/");
              } else {
                next(null, doc.ops[0]);
              }
            },
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      res.redirect("/profile");
    },
  );

  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });

  // app.listen out here...

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
