const { Order } = require("../models/order");
const { Invoice } = require("../models/invoice");
// const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
// const { sendEmail } = require("../helpers");

// exports.orderById = (req, res, next, id) => {
//   Order.findById(id)
//     .populate("products.product", "name price")
//     .exec((err, order) => {
//       if (err || !order) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       req.order = order;
//       next();
//     });
// };

exports.create = (req, res) => {
  console.log("CREATE ORDER: ", req.body);
  req.body.order.user = req.profile;
  const invoice = new Invoice(req.body.invoice);
  invoice.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    // const user = new User(req.profile);
    // // const receiver = res.json(User.schema.path("email"));
    // console.log("user", user.email);
    // // send email alert to admin
    // // order.address
    // // order.products.length
    // // order.amount
    // const emailData = {
    //   from: process.env.EMAIL_FROM,
    //   to: user.email,
    //   subject: `A new order is received`,
    //   html: `
    //         <p>Customer name: ${user.name}</p>
    //         <p>Total products: ${order.products.length}</p>
    //         <p>Total cost: ${order.amount}</p>
    //         <p>Pesanan anda akan diproses secepatnya.</p>
    //     `,
    // };
    // sendEmail(emailData);
    // res.json(data);
  });
};

// exports.listOrders = (req, res) => {
//   Order.find()
//     .populate("user", "_id name address")
//     .sort("-created")
//     .exec((err, orders) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(error),
//         });
//       }
//       res.json(orders);
//     });
// };

// exports.getStatusValues = (req, res) => {
//   res.json(Order.schema.path("status").enumValues);
// };

exports.listOrdersUser = (req, res) => {
  Invoice.find()
    .populate("user", "_id name address")
    .sort("-created")
    .exec((err, invoices) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(invoices);
    });
};

exports.getStatusValuesUser = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

// exports.updateOrderStatus = (req, res) => {
//   Order.update(
//     { _id: req.body.orderId },
//     { $set: { status: req.body.status } },
//     (err, order) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       res.json(order);
//     }
//   );
// };
