import jwt from 'jsonwebtoken';

const authentication = async (req, res , next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next('This user is unauthorized');
        }
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        if (user) {
            req.user = user;
            return next();
        } else {
            return next('This user is unauthorized');
        }
    } catch (err) {
        return next('This user is unauthorized');
    }
}

export default authentication;


