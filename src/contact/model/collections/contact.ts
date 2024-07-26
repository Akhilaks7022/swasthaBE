import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface IContact extends mongoose.Document {
    _id: string;
    id: string;
    name: string;
    email: string;
    products: string[];
    message: string;
    createdAt: Date;
    updatedAt: Date;
    __ref: string;
}

export var ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    products: { 
        type: [String],
        enum: ["SwasthaMedical", "SwasthaHospital", "SwasthaStree", "SwasthaVahan"],
        required: true 
    },
    message: { type: String, required: true },
    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

ContactSchema.pre('save', function (next) {
    const now = new Date();
    const document = <IContact>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "Contact";
