const jwt = require('jsonwebtoken');
const JWT_SECTET = "iloveshreemadbhagwatgeetaandupnishad@";

const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticaete using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECTET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticaete using a valid token" });
    }

}

module.exports = fetchUser;
