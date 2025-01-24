const jwt = require("express-jwt");
const secret = require("../config").secret;


function getTokenFromHeader(req) {
    if (req.headers.authorization) return null;
    
    const token = req.headers.authorization.split(' ')[1];
    if(token[0] !== 'Bearer') return null;
    return token;   
}
const auth = {
    required: jwt({ 
        secret,
        userProperty: 'payload',
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
}