import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface IRegistration extends mongoose.Document {
    _id: string;
    id: string;
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    current_password: string;
    products: string[];
    mobile_number: number;
    registration_type: string;
    organization_name: string;
    position: string;
    enable_download: boolean;
    createdAt: Date;
    updatedAt: Date;
    __ref: string;
}

export var RegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    confirm_password: { type: String },
    current_password: { type: String },
    products: { 
        type: [String],
        enum: ["SwasthaMedical", "SwasthaHospital", "SwasthaStree", "SwasthaVahan"],
        required: true 
    },
    mobile_number: { type: Number, required: true },
    registration_type: { type: String, required: true },
    organization_name: { type: String },
    position: { type: String },
    enable_download: { type: Boolean },
    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

RegistrationSchema.pre('save', function (next) {
    const now = new Date();
    const document = <IRegistration>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "Registration";
