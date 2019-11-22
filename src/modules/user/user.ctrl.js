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

        const updateUserDataInRealm = (data,callback) => {
            userModel.updateUserDataInRealm(data,callback); 
        }

        async.waterfall([
            checkRequest,
            updateUserDataInRealm
        ],(err,result) => {
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
    updateUserById
}