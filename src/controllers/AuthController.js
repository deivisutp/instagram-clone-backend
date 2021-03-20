const User = require("../models/User");
const { validationResult } = require("express-validator");

const passwordCompare = require("./utils/passwordCompare");
const generateToken = require("./utils/generateToken");

module.exports = {

    async me(req, res) {
        const user = await User.findByPk(req.userId, {
            attributes: ["id", "username", "name", "avatar_url"]
        });

        req.redis.setex(req.userId, 3600, JSON.stringify(user));

        return res.json(user);
    },

    async login(req, res) {
        const { username, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

        let user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).send({ message: "Usuário não existe, verifique suas credenciais" });

        if (! await passwordCompare(password, user.password)) return res.status(400).send({ message: "Credencial inválida" });

        const payload = { id: user.id, username: user.username };
        const token = generateToken(payload);
        return res.status(200).json({ token });
    }
}