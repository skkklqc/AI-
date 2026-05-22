import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    contactSnapshot: { type: String, default: "" },
    cancelReason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date }
  },
  { timestamps: true }
);

orderSchema.index({ book: 1, buyer: 1, status: 1 });

export const Order = mongoose.model("Order", orderSchema);
