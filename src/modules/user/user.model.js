const Realm = require('realm');
const userSchema = require('../../config/schema');
const moment = require('moment');
const unique_id = require('uuid/v1');

const checkAddUserRequest = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        if (typeof req !== 'object') {
            return !!callback({
                message: "Requets is not correct! Please check"
            }, null);
        } else {
            return !!callback(null, req);
        }
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const addUserToRealm = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        let data = req;
        data.id = unique_id();
        data.status = "true";
        data.created_at = moment(Date.now()).format('YYYY-MM-DD').toString();
        data.updated_at = moment(Date.now()).format('YYYY-MM-DD').toString();
        Realm.open({
                schema: [users]
            })
            .then(realm => {
                realm.write(() => {
                    realm.create('User', data)
                })
                return !!callback(null, {
                    message: 'User added successfully!'
                })
            })
            .catch((err) => {
                console.log(err);
                return !!callback({
                    message: err.message
                }, null);
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const getAllUsers = async (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        Realm.open({
                schema: [users]
            })
            .then(async (realm) => {
                let userData = await realm.objects('User');
                req.users = userData;
                return !!callback(null, req);
            })
            .catch((err) => {
                console.log(err);
                return !!callback({
                    message: err.message,
                }, null)
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const checkUniqueEmail = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        Realm.open({
                schema: [users]
            })
            .then(async (realm) => {
                let userData = await realm.objects('User').filtered('email = "' + req.email + '"');
                if (userData.length > 0) {
                    return !!callback({
                        message: "Email id already exists!"
                    }, null);
                } else {
                    return !!callback(null, req);
                }
            })
            .catch((err) => {
                console.log(err);
                return !!callback({
                    message: err.message,
                }, null)
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const updateRequestCheck = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        if (typeof req === 'object') {
            return !!callback(null, req);
        } else {
            return !!callback({
                message: "Invalid request!"
            }, null);
        }
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const updateUserDataInRealm = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        let data = req;
        data.updated_at = moment(Date.now()).format('YYYY-MM-DD').toString();
        Realm.open({
                schema: [users]
            })
            .then(realm => {
                realm.write(async () => {
                    let update = await realm.create('User', data);
                    return !!callback(null, {
                        message: "User updated successfully!"
                    })
                })
            })
            .catch((err) => {
                console.log(err);
                return !!callback({
                    message: err.message
                }, null);
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

module.exports = {
    checkAddUserRequest,
    addUserToRealm,
    getAllUsers,
    checkUniqueEmail,
    updateRequestCheck,
    updateUserDataInRealm
}