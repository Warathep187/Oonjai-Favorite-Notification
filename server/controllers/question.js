const db = require("../db");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");

class QuestionController {
    async createQuestion(req, res) {
        const { title, content, topicId } = req.body;
        const { userId } = req.user;

        const titleSlug = slugify(title);

        try {
            const [isExists] = await db.connection.query("SELECT id FROM questions WHERE title_slug=?", [titleSlug]);

            if (isExists) {
                return res.status(409).send({
                    message: "คำถามนี้ถูกถามไปแล้ว",
                });
            }

            const questionId = v4();

            await db.connection.query("BEGIN");
            await db.connection.query(
                "INSERT INTO questions (id, title, title_slug, content, topic_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                [questionId, title, titleSlug, content, topicId, userId]
            );

            // Send notification to interested doctors
            const query = `
                SELECT DISTINCT user_id FROM interested_in
                LEFT JOIN users
                ON interested_in.topic_id=? AND interested_in.user_id = users.id
                WHERE users.role="DOCTOR"
            `;
            const interestedUserIds = await db.connection.query(query, [topicId]);
            if (interestedUserIds.length > 0) {
                let valueStatements = "";
                let userIdsStatement = "(";
                for (let i = 0; i < interestedUserIds.length; i++) {
                    i === interestedUserIds.length - 1
                        ? (valueStatements += `("${v4()}", "${
                              interestedUserIds[i].user_id
                          }", "QUESTION", "${questionId}", NOW())`)
                        : `(("${v4()}", "${interestedUserIds[i].user_id}", "QUESTION", "${questionId}", NOW())), `;
                    i === interestedUserIds.length - 1
                        ? (userIdsStatement += `"${interestedUserIds[i].user_id}")`)
                        : (userIdsStatement += `"${interestedUserIds[i].user_id}",`);
                }
                await db.connection.query(
                    `INSERT INTO notifications (id, to_user_id, type, question_id, created_at) VALUES ${valueStatements}`
                );
                await db.connection.query(
                    `UPDATE users SET unread_notification = unread_notification + 1 WHERE id IN ${userIdsStatement}`
                );
            }

            await db.connection.query("COMMIT");

            res.status(201).send({
                message: "คำถามถูกสร้างแล้ว",
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async getQuestion(req, res) {
        const {titleSlug} = req.params;
        try {
            const query = `
                SELECT questions.id AS id, title, content, topic, name, url, questions.created_at AS created_at FROM questions
                LEFT JOIN topics
                ON questions.topic_id=topics.id
                LEFT JOIN users
                ON questions.user_id=users.id
                LEFT JOIN profile_images
                ON users.id=profile_images.user_id
                WHERE questions.title_slug=?
            `
            const [question] = await db.connection.query(query, [titleSlug]);
            if(!question) {
                return res.status(404).send({
                    message: "ไม่พบคำถาม"
                })
            }
            res.send({
                question
            })
        }catch(e) {
            console.log(e);
            res.status(500).send({
                message: "Something went wrong"
            })
        }
    }
}

module.exports = QuestionController;
