const { check } = require("express-validator");

const ValidationAuth = {
    login: [
        check("username", "Insira seu usuário").not().isEmpty(),
        check("password", "Insira sua senha").not().isEmpty(),
    ]
}

module.exports = ValidationAuth;