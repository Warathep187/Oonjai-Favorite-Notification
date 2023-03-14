const jwt = require("jsonwebtoken");

class AuthorizationMiddleware {
    verifyGeneralUser(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({
                    message: "Unauthorized"
                })
            }
            token = token.split(" ")[1];
            jwt.verify(token, process.env.JWT_AUTHORIZATION_KEY, (err, result) => {
                if (err) {
                    throw new Error();
                } else {
                    const decoded = result;
                    if (decoded.role !== "PATIENT") {
                        return res.status(401).send({
                            message: "Unauthorized",
                        });
                    }
                    req.user = {
                        role: decoded.role,
                        userId: decoded.sub,
                    };
                    next();
                }
            });
        } catch (e) {
            res.status(401).send({
                message: "Unauthorized",
            });
        }
    }

    verifyDoctor(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({
                    message: "Unauthorized"
                })
            }
            token = token.split(" ")[1];
            jwt.verify(token, process.env.JWT_AUTHORIZATION_KEY, (err, result) => {
                if (err) {
                    throw new Error();
                } else {
                    const decoded = result;
                    if (decoded.role !== "DOCTOR") {
                        return res.status(401).send({
                            message: "Unauthorized",
                        });
                    }
                    req.user = {
                        role: decoded.role,
                        userId: decoded.sub,
                    };
                    next();
                }
            });
        } catch (e) {
            res.status(401).send({
                message: "Unauthorized",
            });
        }
    }

    verifyUser(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({
                    message: "Unauthorized"
                })
            }
            token = token.split(" ")[1];
            jwt.verify(token, process.env.JWT_AUTHORIZATION_KEY, (err, result) => {
                if (err) {
                    throw new Error();
                } else {
                    const decoded = result;
                    req.user = {
                        role: decoded.role,
                        userId: decoded.sub,
                    };
                    next();
                }
            });
        } catch (e) {
            res.status(401).send({
                message: "Unauthorized",
            });
        }
    }
}

module.exports = AuthorizationMiddleware;
