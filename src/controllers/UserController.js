const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const aws = require("aws-sdk");

const User = require("../models/User");
const Photo = require("../models/Photo");
const Follow = require("../models/Follow");

const PasswordHash = require("./utils/passwordHash");
const passwordCompare = require("./utils/passwordCompare");
const generateToken = require("./utils/generateToken");

const s3 = new aws.S3();

module.exports = {
    async show(req, res) {
        const { username } = req.params;
        //Pagination
        const { page, pageSize } = req.query;

        const user = await User.findOne({
            where: { username },
            attributes: { exclude: ["password", "updatedAt"] },
            include: [
                {
                    association: "photoUploads",
                    separate: true,
                    offset: page * pageSize,
                    limit: pageSize
                }
            ],
            group: ["User.id"]
        });

        if (!user) return res.status(404).send({ message: "Usuário não encontrado" });


        const count_photos = await Photo.findAll({ where: { user_id: user.id } });
        const count_follows = await Follow.findAll({ where: { user_from: user.id } });
        const count_followers = await Follow.findAll({ where: { user_to: user.id } });

        let isProfile = false;
        if (user.id === req.userId) isProfile = true;

        let isFollow = await Follow.findOne({
            where: {
                [Sequelize.Op.and]: [{ user_from: req.userId }, { user_to: user.id }]
            }
        })

        return res.json({
            user,
            count_photos: count_photos.length,
            count_follows: count_follows.length,
            count_followers: count_followers.length,
            isProfile,
            isFollow: isFollow ? true : false
        });
    },

    async store(req, res) {
        const { name, email, username, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

        let userFind = await User.findOne({
            where: { [Sequelize.Op.or]: [{ email }, { username }] }
        });

        if (userFind) {
            if (userFind.email === email) return res.status(400).json({ message: "Este e-mail já está em uso" });
            if (userFind.username === username) return res.status(400).json({ message: "Este usuário já está em uso" });
        }

        //Hash password
        const passwordHash = await PasswordHash(password);

        const user = await User.create({
            name,
            email,
            username,
            password: passwordHash
        })

        //JWT
        const payload = { id: user.id, username: user.username };

        return res.send({
            user,
            token: generateToken(payload),
        });
    },

    async update(req, res) {
        const { name, email, username, phone, bio } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

        await User.update({
            name,
            email,
            username,
            phone,
            bio
        },
            {
                where: { id: req.userId }
            });

        return res.json({ message: "Atualizado com sucesso." })
    },

    async updatePassword(req, res) {
        const { password_old, password, password_confirm } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

        const user = await User.findByPk(req.userId);

        if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

        if (! await passwordCompare(password_old, user.password)) return res.status(400).json({ message: "Password inválido" });

        if (password !== password_confirm) return res.status(400).json({ message: "As senha de confirmação deve ser igual a senha informada" });

        //Hash password
        const passwordHash = await PasswordHash(password);

        await User.update({ password: passwordHash }, { where: { id: req.userId } });

        return res.json({ message: "Atualizado com sucesso." })
    },

    async updateAvatar(req, res) {
        const { key, location: url = "" } = req.file;

        if (!process.env.STORAGE_TYPE === "s3") {
            if (fs.existsSync(path.resolve(__dirname, "..", "..", "tmp", "uploads", key))) {
                promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", key));
            } else {
                return res.status(400).send({ message: "Arquivo não encontrado" });
            }
        }

        await User.update({
            key,
            avatar_url: url || `${process.env.APP_URL}/files/${key}`
        },
            {
                where: { id: req.userId }
            }
        );

        return res.json({ avatar_url: url || `${process.env.APP_URL}/files/${key}` });
    }
}