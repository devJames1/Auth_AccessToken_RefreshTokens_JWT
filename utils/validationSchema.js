import Joi from "joi";
import passwordComplexity from "joi-password-complexity";


// signup validation
const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        userName: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(body);
}

//login validation
const loginBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    })
    return schema.validate(body);
}

//refresh token validation
const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    })
    return schema.validate(body);
}

export { signUpBodyValidation, loginBodyValidation, refreshTokenBodyValidation }