import Parcel, { STATUSES, TRUCK_STATUSES } from '../models/Parcel.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { makeTrackingNumber } from '../utils/trackingNumber.js';

export async function createParcel(req, res) {
  const body = req.validated.body; const trackingNumber = body.trackingNumber || makeTrackingNumber();
  if (body.driverId && !(await User.exists({ _id: body.driverId, role: 'driver' }))) throw new AppError('Selected driver was not found.', 400);
  const truckStatus = body.driverId ? 'Loading' : 'Awaiting driver update';
  const parcel = await Parcel.create({ ...body, trackingNumber, customer: body.customerId, driver: body.driverId || null, currentTruckStatus: truckStatus, createdBy: req.user._id, history: [{ status: 'Order Created', truckStatus, location: body.origin || '', note: body.driverId ? 'Shipment registered and assigned to a driver.' : 'Shipment registered.' }] });
  res.status(201).json({ parcel });
}
export async function trackParcel(req, res) { const parcel = await Parcel.findOne({ trackingNumber: req.validated.params.trackingNumber }).select('-customer -createdBy').populate('driver', 'name vehicleNumber'); if (!parcel) throw new AppError('No parcel was found with this tracking number.', 404); res.json({ parcel }); }
export async function listParcels(req, res) {
  const { page, limit, status, search } = req.validated.query; const filter = {};
  if (req.user.role === 'customer') filter.customer = req.user._id;
  if (req.user.role === 'driver') filter.driver = req.user._id;
  if (status) filter.currentStatus = status;
  if (search) filter.$or = [{ trackingNumber: { $regex: search, $options: 'i' } }, { 'receiverDetails.name': { $regex: search, $options: 'i' } }, { destination: { $regex: search, $options: 'i' } }];
  const [parcels, total] = await Promise.all([Parcel.find(filter).populate('customer', 'name email').populate('driver', 'name vehicleNumber').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Parcel.countDocuments(filter)]);
  res.json({ parcels, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
export async function updateStatus(req, res) {
  const { status, location, note, truckStatus } = req.validated.body; const parcel = await Parcel.findById(req.validated.params.id);
  if (!parcel) throw new AppError('Parcel not found.', 404);
  if (req.user.role === 'driver') {
    if (String(parcel.driver) !== String(req.user._id)) throw new AppError('You can only update shipments assigned to you.', 403);
    if (status && !['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].includes(status)) throw new AppError('Drivers may only post delivery progress statuses.', 403);
  }
  const nextStatus = status || parcel.currentStatus; const nextTruckStatus = truckStatus || parcel.currentTruckStatus;
  parcel.currentStatus = nextStatus; parcel.currentTruckStatus = nextTruckStatus;
  parcel.history.push({ status: nextStatus, truckStatus: nextTruckStatus, location, note }); await parcel.save();
  res.json({ parcel });
}
export async function removeParcel(req, res) { const parcel = await Parcel.findById(req.validated.params.id); if (!parcel) throw new AppError('Parcel not found.', 404); if (req.user.role === 'customer' && String(parcel.customer) !== String(req.user._id)) throw new AppError('You may only cancel your own shipments.', 403); if (parcel.currentStatus === 'Delivered') throw new AppError('Delivered shipments cannot be cancelled.', 400); parcel.currentStatus = 'Cancelled'; parcel.history.push({ status: 'Cancelled', note: 'Shipment cancelled.' }); await parcel.save(); res.json({ message: 'Shipment cancelled.', parcel }); }
export { STATUSES, TRUCK_STATUSES };
