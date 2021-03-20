const { Op } = require("sequelize");

const Like = require("../models/Like");
const Photo = require("../models/Photo");

module.exports = {
    async store(req, res) {
        const { photo: photoId } = req.params;

        const photo = await Photo.findByPk(photoId);

        if (!photo) return res.status(400).send({ message: "Foto não encontrada" });

        let like = await Like.findOne({
            where: { [Op.and]: [{ photo_id: photoId }, { user_id: req.userId }] }
        });

        if (!like) {
            const newLike = await Like.create({
                user_id: req.userId,
                photo_id: photo.id
            });
            return res.status(200).json(newLike);
        } else {
            await like.destroy();
            return res.status(200).json({ message: "Removed" });
        }
    }
}