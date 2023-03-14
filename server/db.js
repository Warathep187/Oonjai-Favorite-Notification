const { createConnection } = require("mysql2");
const util = require("util")
const fs = require("fs");

class DB {
    connection;

    async connect() {
        try {
            this.connection = await createConnection({
                host: "localhost",
                user: "root",
                password: "1234",
                database: "oonjai",
                multipleStatements: true,
            });
            await this.connection.connect();
            this.connection.query = util.promisify(this.connection.query);
            await this.connection.execute("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
            console.log("MySQL is connected");
            await this.createTables();
        } catch (e) {
            throw new Error(e);
        }
    }

    readSqlFileContent() {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + "/schema.sql", "utf-8", (err, content) => {
                if (err) {
                    reject(err);
                }
                resolve(content);
            });
        });
    }

    async createTables() {
        try {
            const sqlCreateTableCommands = await this.readSqlFileContent();
            await this.connection.query("BEGIN;");
            await this.connection.query(sqlCreateTableCommands);
            await this.connection.query("COMMIT;");
        } catch (e) {
            throw new Error(e);
        }
    }
}

const db = new DB();
db.connect()

module.exports = db;
