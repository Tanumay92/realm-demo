'use strict';
const async = require('async');
const env = require('../../config/env');
const userModel = require('./user.model');

const addUser = (req, res) => {
    let response = {};
    try {
        let params = req.body.params || {};

        const checkRequest = (callback) => {
            userModel.checkAddUserRequest(params, callback);
        };

        const checkUniqueEmail = (data, callback) => {
            userModel.checkUniqueEmail(data, callback);
        }

        const addUserToRealm = (data, callback) => {
            userModel.addUserToRealm(data, callback);
        }

        async.waterfall([
            checkRequest,
            checkUniqueEmail,
            addUserToRealm
        ], (err, result) => {
            if (err !== null) {
                response.error = err;
            } else {
                response.result = result;
            }

            res.send(response);
        })
    } catch (e) {
        console.log(e);
        response.error = e.message;
        res.send(response);
    }
}

const getAllUSer = (req, res) => {
    let response = {};
    try {
        let params = {};
        const fetchUserListData = (callback) => {
            userModel.getAllUsers(params, callback)
        };

        async.waterfall([
            fetchUserListData
        ], (err, result) => {
            if (err !== null) {
                response.error = err;
            } else {
                response.result = result;
            }
            res.send(response);
        })
    } catch (e) {
        console.log(e);
        response.error = e.message;
        res.send(response);
    }
}

const updateUserById = (req, res) => {
    let response = {};
    try {
        let params = req.body.params || {};
        params.id = req.params.id;

        const checkRequest = (callback) => {
            userModel.updateRequestCheck(params, callback);
        };

        const updateUserDataInRealm = (data, callback) => {
            userModel.updateUserDataInRealm(data, callback);
        }

        async.waterfall([
            checkRequest,
            updateUserDataInRealm
        ], (err, result) => {
            if (err !== null) {
                response.error = err;
            } else {
                response.result = result;
            }
            res.send(response);
        })
    } catch (e) {
        console.log(e);
        response.error = e.message;
        res.send(response);
    }
}

const getUserById = (req, res) => {
    let response = {};
    try {
        let params = {};
        params.id = req.params.id;

        let getUserDetailsById = (callback) => {
            userModel.getUserDetailsById(params, callback);
        }

        async.waterfall([
            getUserDetailsById
        ], (err, result) => {
            if (err !== null) {
                response.error = err;
            } else {
                response.result = result;
            }
            res.send(response);
        })
    } catch (e) {
        console.log(e);
        response.error = e.message;
        res.send(response);
    }
}

const deleteUserById = (req, res) => {
    let response = {};
    try {
        let params = {};
        params.id = req.params.id;

        let checkRequest = (callback) => {
            if (params.id) {
                return !!callback(null, params);
            } else {
                return !!callback({
                    message: 'User id missing!'
                }, null);
            }
        };

        let deleteUserFromRealm = (data, callback) => {
            userModel.deleteUserFromRealm(data, callback);
        }

        async.waterfall([
            checkRequest,
            deleteUserFromRealm
        ], (err, result) => {
            if (err !== null) {
                response.error = err;
            } else {
                response.result = result
            }
            res.send(response);
        })
    } catch (e) {
        console.log(e);
        response.error = e.message;
        res.send(response);
    }
}

const login = (req, res) => {
    let response = {};
    try {
        let params = req.body.params;
        let checkRequest = (callback) => {
            if(!params.loginKey || !params.password) {
                return !!callback({message : "Invalid request!"}, null);
            } else {
                return !!callback(null,params);
            }
        };

        let verifyLoginRequest = (data,callback) => {
            userModel.verifyLogin(data, callback);
        }

        async.waterfall([
            checkRequest,
            verifyLoginRequest
        ], (err,result) => {
            if(err !== null) {
                response.error = err;
            } else {
                response.result = result;
            }
            res.send(response);
        })
    } catch (e) {
        console.log(e);
        response.error = e.message;
        res.send(response);
    }
}

module.exports = {
    addUser,
    getAllUSer,
    updateUserById,
    getUserById,
    deleteUserById,
    login
}