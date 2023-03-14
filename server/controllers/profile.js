const db = require("../db");
const { LoggedInUser } = require("../classes/user");

class ProfileController {
    async getProfile(req, res) {
        const { userId } = req.user;
        try {
            const [user] = await db.connection.query(
                "SELECT id, name, role, unread_notification FROM users WHERE id=?",
                [userId]
            );

            const loggedInUser = new LoggedInUser(user);

            res.send({
                user: {
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    role: loggedInUser.role,
                    unreadNotification: loggedInUser.unreadNotification,
                },
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    }
}

module.exports = ProfileController;
