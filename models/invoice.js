const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

// const CartItemSchema = new mongoose.Schema(
//   {
//     product: { type: ObjectId, ref: "Product" },
//     name: String,
//     price: Number,
//     count: Number,
//   },
//   { timestamps: true }
// );

// const CartItem = mongoose.model("CartItem", CartItemSchema);

const InvoiceSchema = new mongoose.Schema(
  {
    // products: [CartItemSchema],
    receipt_id: {},
    // amount: { type: Number },
    // address: String,
    // status: {
    //   type: String,
    //   default: "Not processed",
    //   enum: [
    //     "Not processed",
    //     "Processing",
    //     "Shipped",
    //     "Delivered",
    //     "Cancelled",
    //   ], // enum means string objects
    // },
    createdAt: Date,
    Order: { type: ObjectId, ref: "Order" },
    user: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = {
  Invoice,
  // CartItem
};
