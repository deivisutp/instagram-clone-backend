const { Router } = require("express");

const authMiddleware = require("../middleware/auth");
const CommentController = require("../controllers/CommentController");
const ValidationComment = require("../validations/ValidationComment");

const routes = Router();

routes.use(authMiddleware);

routes.post("/:photo", ValidationComment.comment, CommentController.store);
routes.put("/:idComment", ValidationComment.comment, CommentController.update);
routes.delete("/:idComment", CommentController.destroy);

module.exports = routes;