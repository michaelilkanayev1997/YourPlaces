const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");
const fileUpload = require("../middleware/s3-file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.uploadFile.single("image"), //applying middleware to sign up route
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
