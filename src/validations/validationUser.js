const { check } = require("express-validator");

const ValidationUser = {
    withPassword: [
        check("name", "Insira por favor seu nome completo").not().isEmpty(),
        check("username", "Insira por favor seu usuário").not().isEmpty(),
        check("email", "Insira por favor um e-mail válido").isEmail(),
        check("password", "A senha deve conter no mínimo 6 caracteres").isLength({ min: 6 })
    ],
    withoutPassword: [
        check("name", "Insira por favor seu nome completo").not().isEmpty(),
        check("email", "Insira por favor um e-mail válido").isEmail()
    ],
    password: [
        check("password", "A senha deve conter no mínimo 6 caracteres").isLength({ min: 6 }),
        check("password_confirm", "A senha deve conter no mínimo 6 caracteres").isLength({ min: 6 }),
    ]
}

module.exports = ValidationUser;