const db = require("../db");
const { v4 } = require("uuid");

class AttentionController {
    async getAttentionList(req, res) {
        const { userId, role } = req.user;

        const query = `
            SELECT interested_in.id AS attention_id, topics.id AS topic_id, topics.topic AS topic
            FROM interested_in
            LEFT JOIN topics
            ON interested_in.topic_id=topics.id
            WHERE interested_in.user_id=?
        `;

        try {
            const attentionTopics = await db.connection.query(query, [userId]);
            let user = {
                turnOnNotification: false,
            };
            if (role === "PATIENT") {
                const profileQuery = `SELECT turn_on_notification FROM users WHERE id=?`;
                const [userSettings] = await db.connection.query(profileQuery, [userId]);
                user.turnOnNotification = userSettings.turn_on_notification;
            }

            res.send({
                attentionList: attentionTopics,
                turnOnNotification: user.turnOnNotification,
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async getUnsubscribedTopics(req, res) {
        const { userId } = req.user;
        try {
            const attentionList = await db.connection.query("SELECT topic_id FROM interested_in WHERE user_id=?", [
                userId,
            ]);
            if (attentionList.length > 0) {
                const topicIds = attentionList.map((attentionItem) => attentionItem.topic_id);
                let topicIdsString = "";
                for (let i = 0; i < topicIds.length; i++) {
                    topicIdsString += i === topicIds.length - 1 ? `"${topicIds[i]}"` : `"${topicIds[i]}",`;
                }
                const query = `SELECT * FROM topics WHERE id NOT IN (${topicIdsString})`;
                const topics = await db.connection.query(query);
                
                res.send({
                    topics,
                });
            } else {
                const query = `SELECT * FROM topics`;
                const topics = await db.connection.query(query);
                
                res.send({
                    topics,
                });
            }
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async addTopicToAttentionList(req, res) {
        const { userId } = req.user;
        const { topicId } = req.body;
        try {
            const [topic] = await db.connection.query("SELECT id FROM topics WHERE id=?", [topicId]);
            if (!topic) {
                return res.status(409).send({
                    message: "ไม่พบหัวข้อที่เลือก",
                });
            }
            const attentionId = v4();
            await db.connection.query("INSERT INTO interested_in (id, topic_id, user_id) VALUES (?, ?, ?)", [
                attentionId,
                topicId,
                userId,
            ]);

            const query = `
                SELECT interested_in.id AS attention_id, topics.id AS topic_id, topics.topic AS topic
                FROM interested_in
                LEFT JOIN topics
                ON interested_in.topic_id=topics.id
                WHERE interested_in.id=?
            `;
            const [addedItem] = await db.connection.query(query, [attentionId]);
            
            res.send({
                attentionItem: addedItem,
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async removeTopicFromAttentionList(req, res) {
        const { userId } = req.user;
        const { attentionId } = req.body;
        try {
            const [isAttentionItemExists] = await db.connection.query(
                "SELECT id FROM interested_in WHERE id=? AND user_id=?",
                [attentionId, userId]
            );
            if (!isAttentionItemExists) {
                return res.status(409).send({
                    message: "ไม่พบหัวข้อนี้ในAttention listของคุณ",
                });
            }
            await db.connection.query("DELETE FROM interested_in WHERE id=?", [attentionId]);
            res.status(204).send();
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }
}

module.exports = AttentionController;
