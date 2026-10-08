import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const issueToken = (user) => jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
const respond = (res, user, status = 200) => res.status(status).json({ token: issueToken(user), user });
export async function register(req, res) { const { name, email, password, role, vehicleNumber } = req.validated.body; if (await User.exists({ email })) throw new AppError('An account with this email already exists.', 409); const user = await User.create({ name, email, password, role, vehicleNumber: role === 'driver' ? vehicleNumber : '' }); respond(res, user, 201); }
export async function login(req, res) { const { email, password } = req.validated.body; const user = await User.findOne({ email }).select('+password'); if (!user || !(await user.comparePassword(password))) throw new AppError('Incorrect email or password.', 401); user.password = undefined; respond(res, user); }
export async function me(req, res) { res.json({ user: req.user }); }
