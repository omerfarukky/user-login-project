const httpStatus = require("http-status");
const { passwordToHash } = require("../scripts/utils/helper");
const {
  insert,
  modify,
  activeUser,
  userControlServices,
} = require("../services/Users");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

const verifyUser = (req, res) => {
  activeUser(req.params.activation)
    .then((user) => {
      res
        .status(httpStatus.OK)
        .send(
          `Aramıza hoşgeldin ${user.full_name} hesabın başarıyla aktif edilmiştir.`
        );
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

const resetPassword = (req, res) => {
  const new_password =
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updateUser) => {
      if (!updateUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: "Böyle bir kullanıcı bulunamdı." });
      eventEmitter.emit("send_email", {
        to: updateUser.email, // list of receivers
        subject: "Sifre Sıfırlama", // Subject line
        html: `Talebiniz üzerine sifre sıfırlama islemi gerceklesmistir.
        </br> Sisteme giris yaptıktan sonra sifrenizi değiştimeyi unutmayınız
        </br> Yeni sifreniz : <b>${new_password}</b>`, // html body
      });
      res.status(httpStatus.OK).send({
        message: "Yeni şifreni eposta adresinize gönderdik.",
      });
    })
    .catch((error) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Sifre sıfırlama sırasında bir problem oluştu" });
    });
};

const userControl = (req, res) => {
  userControlServices()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

module.exports = {
  create,
  resetPassword,
  verifyUser,
  userControl,
};
