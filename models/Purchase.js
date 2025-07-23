import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    productId: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    purchaseTime: { type: Date, required: true },
    purchaseToken: { type: String },
    quantity: { type: Number, default: 1 },
    isAcknowledged: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
