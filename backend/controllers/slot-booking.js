import 'dotenv/config';
import { cityWareHouses } from '../constants/constants.js';
import Slots from '../models/slot-booking.js';
import { _getDoc } from '../app.js';

export const slotBookingController = {
    createNewSlot: async (req, res) => {
        try {
            const wareHouseQuantity = await _getQuantityAvailable(req.body);
            if(req.body.quantityUnits <= wareHouseQuantity) {
                const response = await Slots.create({...req.body});
                if(response) {
                    await _saveDataToExcel(response);
                    res.send({ success: true, message: "Slot successfully booked/created!"});
                }    
            } else {
                res.send({ success: false, message: "Selected quantity units are not available in the slot, please select different slot !"});
            }
        }
        catch (error) {
            console.log(error);
            res.send({ error, message: "Couldn't create the slot!"});
        }
    },
    checkForSlot: async (req, res) => {
        try {
            if(req.query) {
                const wareHouseQuantity = await _getQuantityAvailable(req.query);
                res.send({success:true , quantityAvailable: wareHouseQuantity});
            }  
        } catch (error) {
            console.log(error);
            res.send({ error, message: "Couldn't check for slot!"});
        }
    },
    getAllSlotBookings: async (req, res) => {
        try {
            const response = await Slots.find();
            if(response && response.length) {
                res.send({
                    success: true,
                    response
                })
            }
        }
        catch (error) {
            console.log(error);
            res.send({ error, message: "Couldn't create the slot!"});
        }
    },
};

const _getQuantityAvailable = async(data) => {
    const { wareHouseCity , dateInboundings, wareHouseType } = data;
    let wareHouseQuantity = cityWareHouses[wareHouseCity][wareHouseType];
    const bookedSlots = await Slots.find({ dateInboundings, wareHouseCity, wareHouseType });

    if(bookedSlots && bookedSlots.length) {
        bookedSlots.forEach(slot => {
            wareHouseQuantity = wareHouseQuantity - slot.quantityUnits
        });
    }
    return wareHouseQuantity;
}

const _saveDataToExcel = async(data) => {
    try {
        const rowData = {
            'Email' : data.email,
            'Brand' : data.brand,
            'IO/PO Number' : data.IO_PO_number,
            'Key Account Manager' : data.keyAccountManager,
            'Ware House City' : data.wareHouseCity,
            'Ware House Type' : data.wareHouseType,
            'Time Slot' : data.timeSlot,
            'Quantity Units' : data.quantityUnits,
            'Date Inboundings' : data.dateInboundings,
            'Delivery Type' : data.deliveryType,   
            'Industry' :      data.industry, 
        }
        const doc = await _getDoc();
        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow(rowData);

    } catch (error) {
        console.log(error);
    }
}