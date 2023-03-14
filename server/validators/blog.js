class BlogValidator {
    validateBlogData(req, res, next) {
        const { title, content, topicId } = req.body;

        if (!title) {
            return res.status(400).send({
                message: "กรุณากรอกหัวเรื่อง",
            });
        } else if (!content) {
            return res.status(400).send({
                message: "กรุณากรอกรายละเอียดเพิ่มเติม",
            });
        } else if (!topicId) {
            return res.status(400).send({
                message: "กรุณาเลือก Topic",
            });
        } else if(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(topicId)) {
            return res.status(400).send({
                message: "กรุณาเลือก Topic"
            })
        }
        next();
    }
}

module.exports = BlogValidator;
