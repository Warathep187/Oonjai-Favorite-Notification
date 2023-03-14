class AuthValidator {
    validateSignInData(req, res, next) {
        const {email, password} = req.body;
        if(!email) {
            return res.status(400).send({
                message: "กรุณากรอกอีเมล"
            })
        } else if(!password) {
            return res.status(400).send({
                message: "กรุณากรอกรหัสผ่าน"
            })
        }
        next()
    }
}

module.exports = AuthValidator;