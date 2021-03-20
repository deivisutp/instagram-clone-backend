const bcryptjs = require("bcryptjs");

const passwordCompare = async (password_old, password_user) => {
    return await bcryptjs.compare(password_old, password_user);
}

module.exports = passwordCompare;