const jwt = require("jsonwebtoken");

//for fields validation
// const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    })
    return schema.validate(data);
}







function generateAuthToken(user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
    return token;
}

//Middleware verifyToken
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization']
//     if (typeof bearerHeader !== 'undefined') {
//         const bearerToken = bearerHeader.split(' ')[1]
//         req.token = bearerToken
//         next()
//     } else {
//         res.sendStatus(403) //forbiden
//     }
// }

module.exports = { generateAuthToken, validate }