import User from '../models/User.js';
export async function listCustomers(_req, res) { const customers = await User.find({ role: 'customer' }).select('name email').sort({ name: 1 }); res.json({ customers }); }
export async function listDrivers(_req, res) { const drivers = await User.find({ role: 'driver' }).select('name email vehicleNumber').sort({ name: 1 }); res.json({ drivers }); }
