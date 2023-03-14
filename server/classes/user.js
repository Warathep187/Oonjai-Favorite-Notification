const jwt = require("jsonwebtoken");

class User {
    id;
    name;
    role;
    unreadNotification;
}

class LoginUser extends User {
    email;
    password;

    constructor(user) {
        super()
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.unreadNotification = user.unread_notification;
    }

    isValidPassword(enteredPassword) {
        return enteredPassword === this.password;
    }

    signToken(userId, role) {
        return jwt.sign(
            {
                sub: userId,
                role: role,
            },
            process.env.JWT_AUTHORIZATION_KEY
        );
    }
}

class LoggedInUser extends User {
    constructor(user) {
        super();
        this.id = user.id;
        this.name = user.name;
        this.role = user.role;
        this.unreadNotification = user.unread_notification;
    }
}

module.exports = { LoginUser, LoggedInUser };
