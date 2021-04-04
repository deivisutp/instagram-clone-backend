const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const aws = require("aws-sdk");
const Sequelize = require("sequelize");

const Photo = require("../models/Photo");
const Like = require("../models/Like");

const s3 = new aws.S3();

module.exports = {
    async destroy(req, res) {
        const { id } = req.params;
        const { key } = req.query;

        const photo = await Photo.findByPk(id);

        if (!photo) return res.status(400).send({ message: "Foto não encontrada" });

        if (photo.user_id !== req.userId) return res.status(400).send({ message: "Usuário não autorizado" });

        try {
            if (process.env.STORAGE_TYPE === "s3") {
                s3
                    .deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: key
                    })
                    .promise()
                    .then(response => {
                        console.log(response.status);
                    })
                    .catch(response => {
                        console.log(response.status);
                    });
            } else {
                if (fs.existsSync(path.resolve(__dirname, "..", "..", "tmp", "uploads", key))) {
                    promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", key));
                } else {
                    return res.status(400).send({ message: "Arquivo não encontrado" });
                }
            }
        } catch (error) {
            throw error;
        }

        await photo.destroy();

        return res.send({ message: "Deletado" });
    },

    async show(req, res) {
        const { id } = req.params;

        const photo = await Photo.findByPk(id, {
            attributes: {
                exclued: ["updatedAt"],
                include: [[Sequelize.fn(("COUNT"), Sequelize.col("getLikes")), "LikesCount"]]
            },
            include: [
                {
                    association: "uploadedBy",
                    attributes: ["username", "avatar_url"]
                },
                {
                    association: "getLikes",
                    attributes: []
                },
                {
                    association: "getComments",
                    attributes: ["id", "user_id", "body", "createdAt"],
                    include: {
                        association: "postedBy",
                        attributes: ["username", "avatar_url"]
                    }
                }
            ],
            group: [
                "uploadedBy.id",
                "Photo.id",
                "getComments.id",
                "getComments->postedBy.id"
            ]
        });

        if (!photo) return res.status(400).send({ message: "Foto não encontrada" });

        const isAuthor = (photo.user_id === req.userId);

        let isLiked = false;
        const like = await Like.findOne({
            where: {
                [Sequelize.Op.and]: [{ photo_id: photo.id }, { user_id: req.userId }]
            }
        });

        if (like) isLiked = true;

        return res.json({ photo, isAuthor, isLiked });
    },

    async store(req, res) {
        const { key, location: url = "" } = req.file;
        const { body } = req.body;

        const photoCreated = await Photo.create({
            user_id: req.userId,
            body,
            key,
            photo_url: url || `${process.env.APP_URL}/files/${key}`
        });

        const photo = await Photo.findByPk(photoCreated.id, {
            attributes: {
                exclude: ["updatedAt"]
            },
            include: [
                {
                    association: "uploadedBy",
                    attributes: ["username", "avatar_url"]
                },
                {
                    association: "getComments",
                    attributes: {
                        exclude: ["photo_id", "updatedAt"]
                    },
                    include: {
                        association: "postedBy",
                        attributes: ["username"]
                    },
                    limit: 3
                },
                {
                    association: "getLikes",
                    attributes: ["user_id"]
                }
            ],
            order: [["createdAt", "desc"]]
        });

        let isAuthor = (photo.user_id === req.userId);
        let isLiked = false;

        photo.getLikes.map(like => {
            isLiked = (like.user_id === req.userId);
        });

        return res.json({ isAuthor, isLiked, photo });
    }
}