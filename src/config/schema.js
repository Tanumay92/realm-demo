'use strict';
const userSchema = {
     name : 'User',
     properties : {
        id : "string",
        first_name : "string",
		lastName : "string",
		email : "string",
		phone : "string",
		username : "string",
		password : "string",
        address : "string",
        status : "string",
        created_at : "string",
        updated_at : "string"
     }
}

module.exports = {
    userSchema
}