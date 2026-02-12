const express = require("express");
const router = express.Router();
const { browseOnlyMode } = require('../config');

const blog = require("./blog/");
const persons = require('./persons/');
const articles = require('./articles/');
const effects = require("./effects/");
const replications = require("./replications/");
const profiles = require("./profiles/");
const reports = require("./reports/");
const search = require("./search/");
const redirects = require("./redirects");
const users = require("./users/");
const invitations = require("./invitations/");
const server = require("./server/");
const otps = require("./otps/");

const errorHandler = function(err, req, res, next) {
  if (err["type"] === "API") {
    let error = { name: err["name"], message: err["message"] };
    res.status(err["code"]).send({ error });
  } else if (err.name == 'UnauthorizedError') {
    let error = { name: "Invalid JWT", message: "The JWT is invalid." };
    res.status(401).send({ error });
  } else {
    console.log(err);
    res.status(500).send(err);
  }
};


router
  .use("/persons", persons)
  .use("/articles", articles)
  .use("/blog", blog)
  .use("/effects", effects)
  .use("/replications", replications)
  .use("/profiles", profiles)
  .use("/reports", reports)
  .use("/search", search)
  .use("/redirects", redirects);

if (!browseOnlyMode) {
  router
    .use("/users", users)
    .use("/invitations", invitations)
    .use("/server", server)
    .use("/otps", otps);
}

router.use(errorHandler);


module.exports = router;
