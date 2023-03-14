const db = require("../db");
const { LoginUser } = require("../classes/user");

class AuthController {
    async signin(req, res) {
        const { email, password } = req.body;

        try {
            const [user] = await db.connection.query(
                "SELECT id, name, email, password, role, unread_notification FROM users WHERE email=?",
                [email]
            );
            if (!user) {
                return res.status(400).send({
                    message: "ไม่พบบัญชีผู้ใช้",
                });
            }
            const loginUser = new LoginUser(user);
            if (!loginUser.isValidPassword(password)) {
                return res.status(400).send({
                    message: "รหัสผ่านไม่ถูกต้อง",
                });
            }

            const token = loginUser.signToken(loginUser.id, loginUser.role);

            res.send({
                id: loginUser.id,
                name: loginUser.name,
                role: loginUser.role,
                unreadNotification: loginUser.unreadNotification,
                token,
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }
}

module.exports = AuthController;
