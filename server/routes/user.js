const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const UserController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");

router.post("/get", isAuth, UserController.getUsers);
router.get("/getdepartments", isAuth, UserController.getUsersDepartment);
router.get("/getsearch/:fio/", isAuth, UserController.getUsersBySearch);
router.get(
  "/getsearchwithoutdirector/:fio/",
  isAuth,
  UserController.getUsersBySearchWithoutDirector
);
router.get("/getmanagers/:fio", isAuth, UserController.getManagersBySearch);
router.get(
  "/getcallmanagers/:fio",
  isAuth,
  UserController.getCallManagersBySearch
);
router.get("/getbuyers/:fio", isAuth, UserController.getBuyersBySearch);
router.get(
  "/getmanagers/:fio/:region/",
  isAuth,
  UserController.getManagersBySearch
);
router.post("/post", isAuth, upload.any("photos"), UserController.addUser);
router.post("/login", UserController.authLogin);
router.post("/refresh", UserController.refreshToken);
router.delete("/delete", isAuth, UserController.deleteUser);
router.post("/resetpass", UserController.resetPassword);
router.post("/test", UserController.generatePassword);
router.post(
  "/update",
  isAuth,
  upload.fields([{ name: "avatar" }, { name: "passport_photo" }]),
  UserController.editUser
);
router.post("/remind", isAuth, UserController.remindPassword);
router.post("/number", isAuth, UserController.resetInnerNumber);
router.post("/changerole", isAuth, UserController.changeRole);
router.post("/getuserstree", isAuth, UserController.getUsersTreeList);
router.get("/getByRole", isAuth, UserController.getUsersByRole);

module.exports = router;
