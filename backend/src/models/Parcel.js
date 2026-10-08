import mongoose from 'mongoose';

export const STATUSES = ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];
export const TRUCK_STATUSES = ['Awaiting driver update', 'Loading', 'On Route', 'Delayed', 'At Delivery Point', 'Available', 'Offline'];
const contactSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, trim: true, lowercase: true }, phone: { type: String, required: true, trim: true }, address: { type: String, required: true, trim: true } }, { _id: false });
const historySchema = new mongoose.Schema({ status: { type: String, enum: STATUSES, required: true }, truckStatus: { type: String, enum: TRUCK_STATUSES, default: 'Awaiting driver update' }, timestamp: { type: Date, default: Date.now }, location: { type: String, trim: true, default: '' }, note: { type: String, trim: true, default: '' } }, { _id: false });
const parcelSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
  senderDetails: { type: contactSchema, required: true }, receiverDetails: { type: contactSchema, required: true },
  currentStatus: { type: String, enum: STATUSES, default: 'Order Created' }, weight: { type: Number, required: true, min: 0.01 },
  destination: { type: String, required: true, trim: true }, estimatedDeliveryDate: { type: Date, required: true },
  history: { type: [historySchema], default: [] }, customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  currentTruckStatus: { type: String, enum: TRUCK_STATUSES, default: 'Awaiting driver update' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('Parcel', parcelSchema);
