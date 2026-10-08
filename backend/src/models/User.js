import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'driver', 'courier_staff', 'admin'], default: 'customer' },
  vehicleNumber: { type: String, trim: true, maxlength: 40, default: '' }
}, { timestamps: true, toJSON: { transform: (_, ret) => { delete ret.password; return ret; } } });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); next();
});
userSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.password); };
export default mongoose.model('User', userSchema);
