import express from 'express';
import { slotBookingController } from '../controllers/slot-booking.js';
import authentication from '../middleware/auth.js';
var router = express.Router();

router.post('/create-slot/', authentication , slotBookingController.createNewSlot);
router.get('/check-slot/', authentication , slotBookingController.checkForSlot);
router.get('/get-all-slots/', authentication , slotBookingController.getAllSlotBookings);

export default router;
