const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const Route = require("./route");

class App {
    port;
    app;

    route;

    constructor(port) {
        this.port = port;
        this.app = express();

        this.route = new Route()
    }

    setRoutes() {
        this.app.use("/api", this.route.router);
    }

    setMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    listen() {
        this.app.listen(this.port, () => console.log(`Server is ready on port ${this.port}`));
    }
}

module.exports = App;
