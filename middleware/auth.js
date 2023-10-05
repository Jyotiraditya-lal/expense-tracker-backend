const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ remarks: 'Token is missing' });
    }

    try {
        const user = jwt.verify(token, '9abr8ytd3554bfndjjw5745bngfj985'); // same secret key
        User.findByPk(user.userId)
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ remarks: 'User not found' });
                }
                req.user = user;
                console.log(req.user);
                next();
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ remarks: 'Something went wrong' });
            });
    } catch (error) {
        console.error(error);
        res.status(401).json({ remarks: 'Token is invalid' });
    }
};

module.exports = {
    authenticate
};
