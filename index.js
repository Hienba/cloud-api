const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use("/api", router);

router.render = (req, res) => {
  res.jsonp({ data: res.locals.data });
};

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("JSON Server is running");
});
