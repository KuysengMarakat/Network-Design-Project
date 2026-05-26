// ============================================================
//  KhmerCharm — Admin Controller
//
//  Contains both VULNERABLE demo routes and SECURE routes
//  for the Broken Access Control (BAC) demonstration.
// ============================================================

const db = require("../database/db");

// ─────────────────────────────────────────────
//  ⚠️ VULNERABLE DEMO — Broken Access Control
//  GET /api/admin/demo-users
//
//  This route returns ALL user data (including passwords!)
//  with NO authentication and NO role check.
//
//  ATTACK: Any anonymous user can call this endpoint and get
//          the full user list with plain-text passwords.
//
//  HOW TO DEMO:
//    curl http://localhost:5000/api/admin/demo-users
//    → returns all users with passwords exposed
//
//  FIX: See secureUsers below — always use protect + requireRole.
// ─────────────────────────────────────────────
const demoUsersVulnerable = (req, res) => {
  // ⚠️ VULNERABLE DEMO:
  // This is intentionally weak for school demonstration.
  // Do not use in production.
  // There is NO authentication check here at all.
  // Anyone who knows this URL can call it.
  const users = db.prepare("SELECT * FROM users").all();

  console.warn("[⚠️  BROKEN ACCESS CONTROL] /api/admin/demo-users called with NO auth check!");
  console.warn("[⚠️  EXPOSED DATA] Returning", users.length, "users including passwords!");

  return res.json({
    success: true,
    warning: "⚠️ VULNERABLE ENDPOINT — No auth check! Passwords exposed! (DEMO ONLY)",
    message: "This is intentionally vulnerable. In production this would be a critical security breach.",
    data: { users }, // passwords visible in response!
  });
};

// ─────────────────────────────────────────────
//  ✅ SECURE — Proper auth + role enforcement
//  GET /api/admin/secure-users
//
//  Protected by: protect middleware (valid JWT required)
//                requireRole('admin') middleware
//  Passwords are stripped from the response.
// ─────────────────────────────────────────────
const secureUsers = (req, res) => {
  // ✅ At this point, protect has verified the JWT
  //    and requireRole has confirmed role === 'admin'
  const users = db
    .prepare("SELECT id, name, email, role, created_at FROM users")
    .all(); // no password column selected

  return res.json({
    success: true,
    message: "✅ Secure user list — passwords never returned.",
    data: { count: users.length, users },
  });
};

// ─────────────────────────────────────────────
//  GET /api/admin/users
// ─────────────────────────────────────────────
const getAllUsers = (req, res, next) => {
  try {
    const users = db
      .prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
      .all();

    return res.json({
      success: true,
      message: "All users retrieved.",
      data: { count: users.length, users },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/admin/orders
// ─────────────────────────────────────────────
const getAllOrders = (req, res, next) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, u.name AS customer_name, u.email AS customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `).all();

    const ordersWithItems = orders.map((order) => {
      const items = db.prepare(`
        SELECT oi.*, p.name AS product_name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id);
      return { ...order, items };
    });

    return res.json({
      success: true,
      message: "All orders retrieved.",
      data: { count: ordersWithItems.length, orders: ordersWithItems },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  PUT /api/admin/orders/:id/status
//  Body: { status }
// ─────────────────────────────────────────────
const updateOrderStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    db.prepare("UPDATE orders SET status = ? WHERE id = ?")
      .run(status, req.params.id);

    const updated = db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(req.params.id);

    return res.json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: { order: updated },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/admin/dashboard
//  Quick stats for an admin dashboard widget.
// ─────────────────────────────────────────────
const getDashboardStats = (req, res, next) => {
  try {
    const totalUsers    = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
    const totalProducts = db.prepare("SELECT COUNT(*) AS c FROM products").get().c;
    const totalOrders   = db.prepare("SELECT COUNT(*) AS c FROM orders").get().c;
    const totalRevenue  = db.prepare("SELECT COALESCE(SUM(total_usd),0) AS r FROM orders WHERE status != 'cancelled'").get().r;

    const ordersByStatus = db.prepare(`
      SELECT status, COUNT(*) AS count FROM orders GROUP BY status
    `).all();

    const lowStock = db.prepare(
      "SELECT id, name, stock FROM products WHERE stock < 10 ORDER BY stock ASC"
    ).all();

    return res.json({
      success: true,
      message: "Dashboard stats retrieved.",
      data: {
        total_users:    totalUsers,
        total_products: totalProducts,
        total_orders:   totalOrders,
        total_revenue_usd: Math.round(totalRevenue * 100) / 100,
        orders_by_status:  ordersByStatus,
        low_stock_products: lowStock,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  demoUsersVulnerable,
  secureUsers,
};
