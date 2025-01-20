const jwt = require('jsonwebtoken');
const User = require('../model/user');

const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("you are not login");
        }
        const decodedMssg = await jwt.verify(token, "DevTinder@@@123");
        const { _id } = decodedMssg;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("user not found");
        }
        req.user=user;
        next();
    } catch (err) {
        res.status(400).send(`Error : ${err.message}`);
    }

   
}


module.exports = {
    auth,
}