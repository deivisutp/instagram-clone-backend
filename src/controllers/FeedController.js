const Sequelize = require("sequelize");
const User = require("../models/User");
const Photo = require("../models/Photo");

module.exports = {
    async show(req, res) {
        const { page, pageSize } = req.query;

        const user = await User.findByPk(req.userId, {
            attributes: [],
            include: [
                {
                    association: "getFollows",
                    attributes: ["user_to"]
                }
            ]
        });

        let arrayUsers = user.getFollows.map(user => {
            return user.user_to;
        });

        arrayUsers.push(req.userId);


        const count = await Photo.count({
            where: {
                user_id: {
                    [Sequelize.Op.in]: arrayUsers
                }
            }
        });

        let photos = await Photo.findAll({
            offset: page * pageSize,
            limit: pageSize,
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
            where: {
                user_id: {
                    [Sequelize.Op.in]: arrayUsers
                }
            },
            order: [["createdAt", "desc"]]
        });


        let newArray = photos.map(photo => {
            let isAuthor = false;

            isAuthor = photo.user_id == req.userId;

            let isLiked = false;
            photo.getLikes.map(like => {
                isLiked = like.user_id == req.userId;
            });

            return { isAuthor, isLiked, photo };
        });

        res.header("X-Total-Count", count);

        return res.json(newArray);
    },

    async showFollow(req, res) {
        const user = await User.findByPk(req.userId, {
            attributes: [],
            include: [
                {
                    association: "getFollows",
                    attributes: ["user_to"]
                }
            ]
        });

        let arrayUsers = user.getFollows.map(user => {
            return user.user_to;
        });

        const follows = await User.findAll({
            attributes: {
                exclude: ["password", "createdAt", "updatedAt", "key", "bio", "phone"]
            },
            where: { id: { [Sequelize.Op.in]: arrayUsers } }
        });

        return res.json(follows);
    }
}