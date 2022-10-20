import express from 'express';
import { slotBookingController } from '../controllers/slot-booking.js';
var router = express.Router();

router.post('/create-slot/', slotBookingController.createNewSlot);
router.get('/check-slot/', slotBookingController.checkForSlot);
router.get('/get-all-slots/', slotBookingController.getAllSlotBookings);

export default router;
