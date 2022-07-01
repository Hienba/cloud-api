const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use("/api", router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});
router.render = (req, res) => {
  res.jsonp({ data: res.locals.data });
};
