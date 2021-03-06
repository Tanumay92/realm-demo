const Realm = require('realm');
const userSchema = require('../../config/schema');
const moment = require('moment');
const env = require('../../config/env');
const unique_id = require('uuid/v1');
const crypto = require('crypto');

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
        let password = crypto.createHmac("sha1", env.secret_key).update(req.password).digest('hex');
        req.password = password;
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
                    if (req.flag === 'add') {
                        return !!callback({
                            message: "Email id already exists!"
                        }, null);
                    } else {
                        if (req.id !== userData[0].id) {
                            return !!callback({
                                message: "Email id already exists!"
                            }, null);
                        } else {
                            delete req.flag;
                            return !!callback(null, req);
                        }
                    }
                } else {
                    delete req.flag;
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
            .then(async realm => {
                let userData = await realm.objects('User').filtered('id = "' + req.id + '"')[0];
                realm.write(async () => {
                    userData.first_name = req.first_name;
                    userData.last_name = req.last_name;
                    userData.email = req.email;
                    userData.phone = req.phone;
                    userData.username = req.username;
                    userData.address = req.address;
                    userData.updated_at = moment(Date.now()).format('YYYY-MM-DD').toString();
                    return !!callback(null, {
                        message: 'User updated successfully!'
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

const getUserDetailsById = async (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        Realm.open({
                schema: [users]
            })
            .then(async realm => {
                let userData = await realm.objects('User').filtered('id = "' + req.id + '"')[0];
                req.userDetails = userData;
                delete req.id;
                return !!callback(null, req);
            })
            .catch((e) => {
                console.log(e);
                return !!callback(e.message, null);
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const deleteUserFromRealm = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        Realm.open({
                schema: [users]
            })
            .then(async realm => {
                let userData = await realm.objects('User').filtered('id = "' + req.id + '"');
                if (userData.length === 0) {
                    console.log('No data present')
                    return !!callback({
                        message: "Error while trying to delete user! Please try again."
                    })
                } else {
                    realm.write(async () => {
                        let deleteData = await realm.delete(userData);
                        return !!callback(null, {
                            message: "User deleted succfully!"
                        })
                    })
                }
            })
            .catch((e) => {
                console.log(e);
                return !!callback(e.message, null);
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const verifyLogin = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        Realm.open({
                schema: [users]
            })
            .then(async realm => {
                let userData = await realm.objects('User').filtered('username = "' + req.loginKey + '" OR email = "' + req.loginKey + '"');
                if (userData.length === 0) {
                    return !!callback({
                        message: "Username/Email is not associated with any account!"
                    }, null);
                } else {
                    let dbPass = userData[0].password;
                    let password = crypto.createHmac("sha1", env.secret_key).update(req.password).digest('hex');
                    if (dbPass === password) {
                        return !!callback(null, {
                            message: "User logged in successfully!"
                        })
                    } else {
                        return !!callback({
                            message: "Entered password is not correct!"
                        }, null);
                    }
                }
            })
            .catch((e) => {
                console.log(e);
                return !!callback(e.message, null);
            })
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const changePasswordRequestCheck = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        if (!req.id || !req.oldPassword || !req.newPassword) {
            return !!callback({
                message: "Invalid Request!"
            })
        } else {
            return !!callback(null, req);
        }
    } catch (e) {
        console.log(e);
        return !!callback(e.message, null);
    }
}

const changePasswordInDb = (reqarg, callback) => {
    try {
        let req = reqarg || {};
        let users = userSchema.userSchema;
        Realm.open({
                schema: [users]
            })
            .then(async realm => {
                let userData = await realm.objects('User').filtered('id = "' + req.id + '"')[0];
                let oldPass = crypto.createHmac("sha1", env.secret_key).update(req.oldPassword).digest('hex');
                if (userData.password !== oldPass) {
                    return !!callback({
                        message: "Entered old password is not correct!"
                    }, null);
                } else {
                    realm.write(() => {
                        userData.password = req.newPassword;
                        return !!callback(null, {
                            message: "Password changed successfully"
                        })
                    })
                }
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
    updateUserDataInRealm,
    getUserDetailsById,
    deleteUserFromRealm,
    verifyLogin,
    changePasswordRequestCheck,
    changePasswordInDb
}