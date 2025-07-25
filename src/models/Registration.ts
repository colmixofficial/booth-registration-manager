import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistration extends Document {
  // Applicant Type
  applicantType: 'company' | 'association' | 'private';
  
  // Personal/Company Information
  companyName?: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  birthPlace: string;
  
  // Contact Information
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  
  // Stand Information
  productType: string;
  standLength: number;
  standDepth: number;
  standType: 'tent' | 'carStand' | 'carTrailerStand' | 'salesVehicle';
  
  // Requirements
  electricity: {
    needed: boolean;
    type?: '240v-lighting' | '240v-high' | '400v';
    watts?: number;
  };
  water: boolean;
  
  // Additional Information
  productCategory: 'fleaMarket' | 'artisanal';
  artisanalType?: string;
  demonstration: boolean;
  remarks?: string;
  
  // Administrative
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  standNumber?: string;
  totalFee: number;
  
  // Documents
  insuranceDoc?: string;
  standPhotos?: string[];
  productList?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  applicantType: {
    type: String,
    enum: ['company', 'association', 'private'],
    required: true
  },
  
  companyName: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  birthPlace: { type: String, required: true },
  
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  
  productType: { type: String, required: true },
  standLength: { type: Number, required: true },
  standDepth: { type: Number, required: true },
  standType: {
    type: String,
    enum: ['tent', 'carStand', 'carTrailerStand', 'salesVehicle'],
    required: true
  },
  
  electricity: {
    needed: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['240v-lighting', '240v-high', '400v']
    },
    watts: Number
  },
  
  water: { type: Boolean, default: false },
  
  productCategory: {
    type: String,
    enum: ['fleaMarket', 'artisanal'],
    required: true
  },
  artisanalType: String,
  demonstration: { type: Boolean, default: false },
  remarks: String,
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  standNumber: String,
  totalFee: { type: Number, default: 0 },
  
  insuranceDoc: String,
  standPhotos: [String],
  productList: String
}, {
  timestamps: true
});

// Calculate fee based on stand size
RegistrationSchema.pre('save', function(next) {
  this.totalFee = this.standLength * 7; // 7€ per meter
  next();
});

const Registration: Model<IRegistration> = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;