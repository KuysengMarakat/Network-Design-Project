// ============================================================
//  KhmerCharm — Order Controller
// ============================================================

const db = require("../database/db");

// ─────────────────────────────────────────────
//  POST /api/orders
//  Creates an order from the user's current cart.
//  Body: { shipping_address, phone }
// ─────────────────────────────────────────────
const createOrder = (req, res, next) => {
  try {
    const { shipping_address, phone } = req.body;

    // Fetch cart with product details
    const cartItems = db.prepare(`
      SELECT c.quantity, p.id AS product_id, p.name,
             p.price_usd, p.price_khr, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).all(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Add products before placing an order.",
      });
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          success: false,
          message: `"${item.name}" only has ${item.stock} item(s) in stock.`,
        });
      }
    }

    // Compute totals
    const total_usd = Math.round(
      cartItems.reduce((s, i) => s + i.price_usd * i.quantity, 0) * 100
    ) / 100;
    const total_khr = cartItems.reduce((s, i) => s + i.price_khr * i.quantity, 0);

    // Use a transaction so order + items are atomic
    const placeOrder = db.transaction(() => {
      // 1. Create order
      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total_usd, total_khr, status, shipping_address, phone)
        VALUES (?, ?, ?, 'pending', ?, ?)
      `).run(req.user.id, total_usd, total_khr, shipping_address || "", phone || "");

      const orderId = orderResult.lastInsertRowid;

      // 2. Insert order items + decrement stock
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price_usd, price_khr)
        VALUES (?, ?, ?, ?, ?)
      `);
      const decrementStock = db.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ?"
      );

      for (const item of cartItems) {
        insertItem.run(orderId, item.product_id, item.quantity, item.price_usd, item.price_khr);
        decrementStock.run(item.quantity, item.product_id);
      }

      // 3. Clear cart
      db.prepare("DELETE FROM cart WHERE user_id = ?").run(req.user.id);

      return orderId;
    });

    const orderId = placeOrder();

    // Fetch the full order to return
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    const items = db.prepare(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(orderId);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully! 🎉",
      data: { order, items },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/orders   — current user's orders
// ─────────────────────────────────────────────
const getMyOrders = (req, res, next) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id);

    // Attach items to each order
    const ordersWithItems = orders.map((order) => {
      const items = db.prepare(`
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id);
      return { ...order, items };
    });

    return res.json({
      success: true,
      message: "Orders retrieved.",
      data: { count: ordersWithItems.length, orders: ordersWithItems },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/orders/:id
//  Customers can only see their own orders.
//  Admins can see any order.
// ─────────────────────────────────────────────
const getOrderById = (req, res, next) => {
  try {
    const order = db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Non-admin can only view their own orders
    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This is not your order.",
      });
    }

    const items = db.prepare(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);

    return res.json({
      success: true,
      message: "Order retrieved.",
      data: { order, items },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
