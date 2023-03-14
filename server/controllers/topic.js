const db = require("../db")

class TopicController {
    async getAllTopics(req, res) {
        try {
            const topics = await db.connection.query("SELECT * FROM topics ORDER BY topic")

            res.send({
                topics
            })
        }catch(e) {
            res.status(500).send({
                message: "Something went wrong"
            })
        }
    }
}

module.exports = TopicController;
