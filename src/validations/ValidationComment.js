const { check } = require("express-validator");

const ValidationComment = {
    comment: [
        check("body", "O Comentário não pode estar vazio.").not().isEmpty()
    ]
}

module.exports = ValidationComment;