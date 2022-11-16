import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const users = new Schema({
    employeeId: {type: String},
    password: {type: String},
    createdDate: {
        type: Date,
        default: Date.now(),
    },
});

let Users;
export default Users = mongoose.model('Users', users);