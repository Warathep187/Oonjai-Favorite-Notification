const db = require("../db");
const { v4 } = require("uuid");

class NotificationController {
    async getNotifications(req, res) {
        const { userId } = req.user;

        try {
            const query = `
                SELECT notifications.id AS id, to_user_id, type, questions.title_slug AS question_title_slug, blogs.title_slug AS blog_title_slug, notifications.created_at AS created_at
                FROM notifications
                LEFT JOIN questions
                ON notifications.question_id=questions.id
                LEFT JOIN blogs
                ON notifications.blog_id=blogs.id
                WHERE to_user_id=?
                ORDER BY created_at DESC
            `;

            const notifications = await db.connection.query(query, [userId]);

            res.send({
                notifications,
            });

            await db.connection.query("UPDATE users SET unread_notification = 0 WHERE id=?", [userId]);
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async turnOnNotification(req, res) {
        const { userId } = req.user;
        const query = `
            UPDATE users SET turn_on_notification=1
            WHERE id=?
        `;
        try {
            await db.connection.query(query, [userId]);
            res.status(204).send();
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async turnOffNotification(req, res) {
        const { userId } = req.user;
        const query = `
            UPDATE users SET turn_on_notification=0
            WHERE id=?
        `;
        try {
            await db.connection.query(query, [userId]);
            res.status(204).send();
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }
}

module.exports = NotificationController;
