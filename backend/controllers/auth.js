import jwt from 'jsonwebtoken';
import User  from '../models/user.js';
import bcrypt from 'bcrypt';
import xlsx from 'xlsx';
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

export const login = async (req, res, next) => {
	try {
		const authUser = await getUserByUsernameAndPassword(req.body);

		if (authUser) {
			const token = jwt.sign({ employeeId: authUser.employeeId, password: authUser.password }, process.env.JWT_SECRET);
			return res.send({ success:true, token, user: authUser });	
		} else {
			return res.send({ success: false, message: "User is unauthorized! " });
		}

	} catch (error) {
		console.log(error)
		return next(err);
	}
}

export const bulkImport = async (req, res, next) => {
	try {
		const data = req.file;
		var workbook = xlsx.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		let json = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
		await Promise.all(json.map(async user =>{
			await createUser({
				body: {
					employeeId: user['EMP ID'],
					password: user['Password']
				},
			})
		}))
		res.send({success:true})
	} catch (error) {
		console.log(error)
	}
}

export const createUser = async (req, res, next) => {
	try {
		let { employeeId, password } = req.body;
		const existingUser = await User.findOne({ employeeId });
		if (!existingUser) {
			const hash = await hashPassword(10, String(password));
			password = hash;
			const newUser = await User.create({ employeeId,password});
			if (newUser) {
				const token = jwt.sign({ employeeId, password }, process.env.JWT_SECRET);
				if(res)
					return res.send({ token, success: true, message: "User successfully created!" });
			}	
		} else {
			return res.send({ success: false, message: "Employee Id already exists!" });
		}

	} catch (error) {
		console.log(error);
		return res.send({ success: false, error });
	}
}


const compareAsync = (hash, password) => {
	return new Promise(function (resolve, reject) {
		try {
			bcrypt.compare(password, hash, (err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		} catch (error) {
			reject(error)
		}
	});
}

const getUserByUsernameAndPassword = async (authCreds) => {

	const authUser = await User.findOne({ employeeId: authCreds.employeeId });
	if (authUser) {
		if (authUser && await compareAsync(authUser.password, authCreds.password)) {
			return authUser;
		} else {
			return false;
		}
	}
}

const hashPassword = (salt, password) => {
	return new Promise(function (resolve, reject) {
		try {
			bcrypt.genSalt(salt, function (err, salt) {
				bcrypt.hash(password, salt, async (err, hash) => {
					if (err) {
						reject(err);
					} else {
						resolve(hash);
					}
				});
			});
		} catch (error) {
			reject(error)
		}
	});
}