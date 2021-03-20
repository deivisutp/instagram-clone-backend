const { Op } = require("sequelize");

const Follow = require("../models/Follow");
const User = require("../models/User");

module.exports = {
    async store(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) return res.status(400).send({ message: "Usuário não encontrado." });

        if (req.userId == user_id) return res.status(400).send({ message: "Não é possível seguir a si mesmo." });


        let follow = await Follow.findOne({
            where: { [Op.and]: [{ user_to: user_id }, { user_from: req.userId }] }
        });

        if (!follow) {
            const newFollow = await Follow.create({
                user_from: req.userId,
                user_to: user_id
            });
            return res.status(200).json(newFollow);
        } else {
            await follow.destroy();
            return res.status(200).json({ message: "Removed" });
        }
    }
}