

// const Order = require("../models/Order");

// // Get all orders (with optional search)
// exports.getOrders = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const query = search ? { customerName: { $regex: search, $options: "i" } } : {};
//     const orders = await Order.find(query).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch orders", error });
//   }
// };

// // Create order
// exports.createOrder = async (req, res) => {
//   try {
//     const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
//     const order = new Order({ ...req.body, fileUrl });
//     await order.save();
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create order", error });
//   }
// };

// // Get order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch order", error });
//   }
// };

// // Update order
// exports.updateOrder = async (req, res) => {
//   try {
//     const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl;
//     const updated = await Order.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, fileUrl },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update order", error });
//   }
// };

// // Delete order
// exports.deleteOrder = async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.id);
//     res.json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete order", error });
//   }
// };

// const Order = require("../models/Order");

// // Get all orders
// exports.getOrders = async (req, res) => {
//   try {
//     const { search } = req.query;

//     const query = search
//       ? { customerName: { $regex: search, $options: "i" } }
//       : {};

//     const orders = await Order.find(query).sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch orders", error });
//   }
// };

// // Create Order
// exports.createOrder = async (req, res) => {
//   try {
//     const fileUrl = req.file ? req.file.path : null; // Cloudinary URL

//     const order = new Order({
//       ...req.body,
//       fileUrl,
//     });

//     await order.save();

//     res.status(201).json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to create order", error });
//   }
// };

// // Get order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order)
//       return res.status(404).json({ success: false, message: "Order not found" });

//     res.json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch order", error });
//   }
// };

// // Update Order
// exports.updateOrder = async (req, res) => {
//   try {
//     const fileUrl = req.file ? req.file.path : req.body.fileUrl;

//     const updated = await Order.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, fileUrl },
//       { new: true }
//     );

//     res.json({ success: true, updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to update order", error });
//   }
// };

// // Delete Order
// exports.deleteOrder = async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to delete order", error });
//   }
// };

// const Order = require("../models/Order");
// const cloudinary = require("../config/cloudinary");

// // ===============================
// // Get all orders
// // ===============================
// exports.getOrders = async (req, res) => {
//   try {
//     const { search } = req.query;

//     const query = search
//       ? { customerName: { $regex: search, $options: "i" } }
//       : {};

//     const orders = await Order.find(query).sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch orders", error });
//   }
// };

// // ===============================
// // Create Order (File Upload)
// // ===============================
// exports.createOrder = async (req, res) => {
//   try {
//     const fileUrl = req.file ? req.file.path : null; // cloudinary URL

//     const order = new Order({
//       ...req.body,
//       fileUrl,
//     });

//     await order.save();

//     res.status(201).json({ success: true, order });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to create order", error });
//   }
// };

// // ===============================
// // Get order by ID
// // ===============================
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order)
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });

//     res.json({ success: true, order });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch order", error });
//   }
// };

// // ===============================
// // Update Order (with Cloudinary Delete + Re-upload)
// // ===============================
// exports.updateOrder = async (req, res) => {
//   try {
//     let fileUrl = req.body.fileUrl; // existing URL

//     // If a new file is uploaded → delete old from cloudinary
//     if (req.file) {
//       fileUrl = req.file.path; // new Cloudinary URL

//       if (req.body.oldFileUrl) {
//         const publicId = req.body.oldFileUrl.split("/").pop().split(".")[0];

//         // delete old file from Cloudinary
//         await cloudinary.uploader.destroy(`orders/${publicId}`);
//       }
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, fileUrl },
//       { new: true }
//     );

//     res.json({ success: true, order: updatedOrder });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to update order", error });
//   }
// };

// // ===============================
// // Delete Order (Delete From Cloudinary Too)
// // ===============================
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order)
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });

//     // delete cloudinary file if available
//     if (order.fileUrl) {
//       const publicId = order.fileUrl.split("/").pop().split(".")[0];

//       await cloudinary.uploader.destroy(`orders/${publicId}`);
//     }

//     await Order.findByIdAndDelete(req.params.id);

//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to delete order", error });
//   }
// };

const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");
const { sendEmail } = require("../utils/sendEmail");

// ===============================
// Get all orders
// ===============================
exports.getOrders = async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? { customerName: { $regex: search, $options: "i" } }
      : {};

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error,
    });
  }
};

// ===============================
// Create Order (File Upload + Email)
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      serviceType,
      price,
      status,
    } = req.body;

    if (!customerName || !email || !serviceType || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const fileUrl = req.file ? req.file.path : null; // Cloudinary URL

    // ✅ CREATE ORDER
    const order = await Order.create({
      customerName,
      email,
      serviceType,
      price,
      status,
      fileUrl,
    });

    // ✅ SEND EMAIL TO CLIENT
    await sendEmail(
      email,
      "✅ Your Order Has Been Created",
      `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Hello ${customerName},</h2>

          <p>Your order has been <b>successfully created</b>.</p>

          <hr/>

          <p><b>Service:</b> ${serviceType}</p>
          <p><b>Price:</b> ₹${price}</p>
          <p><b>Status:</b> ${status || "Pending"}</p>

          <br/>
          <p>Our team will contact you shortly.</p>

          <p style="margin-top:20px">
            ✨ <b>Astro Consultation Team</b>
          </p>
        </div>
      `
    );

    res.status(201).json({
      success: true,
      message: "Order created & email sent",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error,
    });
  }
};

// ===============================
// Get order by ID
// ===============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error,
    });
  }
};

// ===============================
// Update Order (Cloudinary replace)
// ===============================
exports.updateOrder = async (req, res) => {
  try {
    let fileUrl = req.body.fileUrl;

    // If new file uploaded → delete old file
    if (req.file) {
      fileUrl = req.file.path;

      if (req.body.oldFileUrl) {
        const publicId = req.body.oldFileUrl
          .split("/")
          .pop()
          .split(".")[0];

        await cloudinary.uploader.destroy(`orders/${publicId}`);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fileUrl },
      { new: true }
    );

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error,
    });
  }
};

// ===============================
// Delete Order (Cloudinary delete)
// ===============================
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // delete cloudinary file if exists
    if (order.fileUrl) {
      const publicId = order.fileUrl
        .split("/")
        .pop()
        .split(".")[0];

      await cloudinary.uploader.destroy(`orders/${publicId}`);
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error,
    });
  }
};
