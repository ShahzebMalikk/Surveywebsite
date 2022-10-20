import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const slotBookings = new Schema({
    email: { type: String },
    brand: { type: String },
    IO_PO_number: { type: String },
    keyAccountManager: { type: String },
    wareHouseCity: { type: String },
    wareHouseType: {type: String},
    wareHouseType: {type: String},
    timeSlot: {type: String},
    quantityUnits: {type: String},
    dateInboundings: {type: String},
    deliveryType: {type: String},
    industry: {type: String},
    createdDate: {
        type: Date,
        default: Date.now(),
    },
});

let Slots;
export default Slots = mongoose.model('Slots', slotBookings);