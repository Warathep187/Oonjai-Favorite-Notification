const db = require("../db");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");

class BlogController {
    async createBlog(req, res) {
        const { title, content, topicId } = req.body;
        const { userId } = req.user;

        const titleSlug = slugify(title);

        try {
            const [isExists] = await db.connection.query("SELECT id FROM blogs WHERE title_slug=?", [titleSlug]);

            if (isExists) {
                return res.status(409).send({
                    message: "บล็อคนี้ได้ถูกสร้างไปแล้ว",
                });
            }

            const blogId = v4();

            await db.connection.query("BEGIN");
            await db.connection.query(
                "INSERT INTO blogs (id, title, title_slug, content, topic_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                [blogId, title, titleSlug, content, topicId, userId]
            );

            // Send notification to interested doctors
            const query = `
                SELECT DISTINCT user_id FROM interested_in
                LEFT JOIN users
                ON interested_in.topic_id=? AND interested_in.user_id = users.id
                WHERE users.role="PATIENT" AND users.turn_on_notification=1
            `;
            const interestedUserIds = await db.connection.query(query, [topicId]);
            if (interestedUserIds.length > 0) {
                let valueStatements = "";
                let userIdsStatement = "(";
                for (let i = 0; i < interestedUserIds.length; i++) {
                    i === interestedUserIds.length - 1
                        ? (valueStatements += `("${v4()}", "${
                              interestedUserIds[i].user_id
                          }", "BLOG", "${blogId}", NOW())`)
                        : `(("${v4()}", "${interestedUserIds[i].user_id}", "BLOG", "${blogId}", NOW())), `;
                    i === interestedUserIds.length - 1
                        ? (userIdsStatement += `"${interestedUserIds[i].user_id}")`)
                        : (userIdsStatement += `"${interestedUserIds[i].user_id}",`);
                }
                await db.connection.query(
                    `INSERT INTO notifications (id, to_user_id, type, blog_id, created_at) VALUES ${valueStatements}`
                );
                await db.connection.query(
                    `UPDATE users SET unread_notification = unread_notification + 1 WHERE id IN ${userIdsStatement}`
                );
            }

            await db.connection.query("COMMIT");

            res.status(201).send({
                message: "บล็อคถูกสร้างแล้ว",
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }

    async getQuestion(req, res) {
        const { titleSlug } = req.params;
        try {
            const query = `
                SELECT blogs.id AS id, title, content, topic, name, url, blogs.created_at AS created_at FROM blogs
                LEFT JOIN topics
                ON blogs.topic_id=topics.id
                LEFT JOIN users
                ON blogs.user_id=users.id
                LEFT JOIN profile_images
                ON users.id=profile_images.user_id
                WHERE blogs.title_slug=?
            `;
            const [blog] = await db.connection.query(query, [titleSlug]);
            if (!blog) {
                return res.status(404).send({
                    message: "ไม่พบคำถาม",
                });
            }
            res.send({
                blog,
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }
}

module.exports = BlogController;
