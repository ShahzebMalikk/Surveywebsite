import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import slotRouter from './routes/slot-booking.js';
import fs from 'fs';
import 'dotenv/config';
import mongoose from 'mongoose';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { readFile } from 'fs/promises';

const app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dir = './uploads';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: false,
};

let doc = null;

mongoose.connect(process.env.DB_URL, options).then(()=>{
	console.log("database connected...");
});

app.use('/slot-booking', slotRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
	console.log('Server is up and running on PORT number ' + port);
	doc = _initGoogleSheet();
});

const _initGoogleSheet = async() => {
	
	const _sheetData = {
		index:0,
		creds:  JSON.parse(await readFile(new URL('./slot-booking-365917-6711799dc719.json', import.meta.url))),
		docUrl:  '1MqVk5HXdIRfPrzZVU5K0TKi8Xuacmf4CBI8q_Lh0dos',
		sheetHeaders: ['Email','Brand','IO/PO Number','Key Account Manager','Ware House City','Ware House Type','Time Slot','Quantity Units','Date Inboundings','Delivery Type','Industry'],
	}

	const doc = new GoogleSpreadsheet(_sheetData.docUrl);
	await doc.useServiceAccountAuth(_sheetData.creds);
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[_sheetData.index];
	await sheet.setHeaderRow(_sheetData.sheetHeaders , _sheetData.index + 1);
	return doc;
}

export const _getDoc = () => { return doc };