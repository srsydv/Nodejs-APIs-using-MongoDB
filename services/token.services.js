const jwt = require('jsonwebtoken')
// const createError = require('http-errors')
const moment = require('moment');



const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) res.status(450).send({ message: "Session Expired" })
            else {
                const authuser1 = {
                    email: payload.email,
                    hostname: "",
                    ip: "",
                    sessionID: req.session.id,
                    lastRequestAt: req.session._lastRequestAt
                };
                next();
            }
        });
    } else {
        res.status(401).send({ "result": "Token not provided" })
    }
};

const dataFromToken = (token,result) => {
        // console.log("datafro tokr",token)
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                   console.log(err.name)
                } else {
                  console.log(err.name)
                }
            }
            else{
            result(null,payload)
            }
        });
   
};


const verifyRefreshToken = (req, res, next) => {
    const token = req.body.token;

    if (authHeader) {

        jwt.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return next(createError.Unauthorized())
                } else {

                    return next(createError.Unauthorized(err.message))
                }
            }
            req.payload = payload
            
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateJWT,
    dataFromToken
}