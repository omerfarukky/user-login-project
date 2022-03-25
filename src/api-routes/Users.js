const express = require("express");
const validate = require("../middlewares/validate"); // Validate Middleware
const schemas = require("../validations/Users"); // validations
const { create, verifyUser, resetPassword, userControl } = require("../controllers/Users");
const router = express.Router();

router.route("/").post(validate(schemas.createValidation), create);
router.route("/:activation").get(verifyUser);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation),resetPassword)
router.route("/admin/user-control").get(userControl)

module.exports = router;
