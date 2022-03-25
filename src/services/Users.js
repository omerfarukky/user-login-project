
const User = require("../models/Users");
const {
  generateActivationToken,
  verifyToken,
} = require("../scripts/utils/helper");
const eventEmitter = require("../scripts/events/eventEmitter");

const insert = async (data) => {
  try {
    const user = new User(data);
    user.active = false;
    const activeCode = generateActivationToken(user);
    const newUser = await user.save();
    eventEmitter.emit("send_email", {
      to: user.email, // list of receivers
      subject: "Üyelik Aktivasyonu", // Subject line
      html: `Üyelik işlemlerinizin tamamlanabilmesi için linke tıklayınız :
    </br> <a href="http://localhost:3000/users/${activeCode}"> tıklanıyız </a>`, // html body
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};

const activeUser = async (token) => {
  const user = verifyToken(token);
  const newDate = new Date();
  const newUser = await User.findOneAndUpdate(
    { email: user?._doc.email },
    { active: true, activatedDate: newDate },
    { new: true }
  );
  return newUser;
};

const modify = (where, data) => {
  return User.findOneAndUpdate(where, data, { new: true });
};

const userControlServices = () => {
  const nowDate = new Date();
  const previousDate = new Date();
  previousDate.setDate(nowDate.getDate() - 1);
  const data = User.aggregate([
    {
      $match: {
        activatedDate: {
          $gte: previousDate,
          $lt: nowDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        ActiveUser: {
          $sum: {
            $cond: ["$active", 1, 0],
          },
        },
        PassiveUser: {
          $sum: {
            $cond: ["$active", 0, 1],
          },
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
  return data;
};

module.exports = {
  insert,
  modify,
  activeUser,
  userControlServices,
};
