import { db, handleDbError } from "@/lib/db"

export type Order = {
  id: number
  user_id: number
  status: string
  total_amount: number
  shipping_address: string
  shipping_method: string
  payment_method: string
  payment_status: string
  tracking_number: string | null
  notes: string | null
  created_at: Date
  updated_at: Date
}

export type OrderWithItems = Order & {
  items: {
    id: number
    product_id: number
    quantity: number
    price: number
    product_name: string
    product_image: string
  }[]
}

export async function getUserOrders(userId: number) {
  try {
    const orders = await db.execute(`SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`, [userId])

    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order: Order) => {
        const items = await db.execute(
          `SELECT oi.*, p.name as product_name, pi.image_url as product_image
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
           WHERE oi.order_id = $1`,
          [order.id],
        )

        return {
          ...order,
          items: items.rows,
        }
      }),
    )

    return ordersWithItems
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getOrderById(orderId: number, userId: number) {
  try {
    const order = await db.execute(`SELECT * FROM orders WHERE id = $1 AND user_id = $2`, [orderId, userId])

    if (!order.rows.length) {
      return null
    }

    const items = await db.execute(
      `SELECT oi.*, p.name as product_name, pi.image_url as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
       WHERE oi.order_id = $1`,
      [orderId],
    )

    return {
      ...order.rows[0],
      items: items.rows,
    }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function createOrder(orderData: {
  user_id: number
  total_amount: number
  shipping_address: string
  shipping_method: string
  payment_method: string
  items: { product_id: number; quantity: number; price: number }[]
  notes?: string
}) {
  try {
    // Start a transaction
    await db.execute("BEGIN")

    // Create the order
    const order = await db.execute(
      `INSERT INTO orders (
        user_id, total_amount, shipping_address, shipping_method, 
        payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        orderData.user_id,
        orderData.total_amount,
        orderData.shipping_address,
        orderData.shipping_method,
        orderData.payment_method,
        orderData.notes || null,
      ],
    )

    const orderId = order.rows[0].id

    // Insert order items
    for (const item of orderData.items) {
      await db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price],
      )

      // Update product stock
      await db.execute(
        `UPDATE products SET stock_quantity = stock_quantity - $1
         WHERE id = $2 AND stock_quantity >= $1`,
        [item.quantity, item.product_id],
      )
    }

    // Clear cart items
    await db.execute(`DELETE FROM cart_items WHERE user_id = $1`, [orderData.user_id])

    // Commit the transaction
    await db.execute("COMMIT")

    return order.rows[0]
  } catch (error) {
    // Rollback the transaction on error
    await db.execute("ROLLBACK")
    return handleDbError(error)
  }
}

export async function updateOrderStatus(orderId: number, status: string, userId: number) {
  try {
    const order = await db.execute(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, orderId, userId],
    )

    if (!order.rows.length) {
      return null
    }

    return order.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}
