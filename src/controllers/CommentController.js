const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");

const Comment = require("../models/Comment");
const Photo = require("../models/Photo");

module.exports = {
    async store(req, res) {
        const { body } = req.body;
        const { photo: photo_id } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

        const post = await Photo.findByPk(photo_id);

        if (!post) return res.status(400).json({ errors: "Publicação inexistente." });

        const comment = await Comment.create({
            user_id: req.userId,
            photo_id,
            body
        });

        const newComment = await Comment.findByPk(comment.id, {
            attributes: ["id", "photo_id", "user_id", "body", "createdAt"],
            include: {
                association: "postedBy",
                attributes: ["username", "avatar_url"]
            }
        });

        return res.status(200).json(newComment);
    },

    async update(req, res) {
        const { body } = req.body;
        const { idComment } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

        const comment = await Comment.findByPk(idComment);

        if (!comment) return res.status(400).json({ errors: "Comentário inexistente." });

        if (comment.user_id !== req.userId) res.status(400).json({ errors: "Usuário não autorizado." });

        const newComment = await comment.update({ body });

        return res.json({ newComment });
    },

    async destroy(req, res) {
        const { idComment } = req.params;

        const comment = await Comment.findByPk(idComment);

        if (!comment) return res.status(400).json({ errors: "Comentário inexistente." });

        if (comment.user_id !== req.userId) res.status(400).json({ errors: "Usuário não autorizado." });

        await comment.destroy();

        return res.status(200).json({ message: "Removed." });
    }
}