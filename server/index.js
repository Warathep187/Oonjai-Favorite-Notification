require("dotenv").config()
const App = require("./app")

const app = new App(process.env.PORT);

app.setMiddleware()
app.setRoutes()
app.listen();
