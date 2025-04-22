import { db, handleDbError } from "@/lib/db"

export type CartItem = {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product_name: string
  product_price: number
  product_image: string
}

export async function getUserCart(userId: number) {
  try {
    const cartItems = await db.execute(
      `SELECT ci.*, p.name as product_name, p.price as product_price, 
              pi.image_url as product_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
       WHERE ci.user_id = $1`,
      [userId],
    )

    // Calculate total
    const total = cartItems.rows.reduce((sum: number, item: any) => {
      return sum + item.product_price * item.quantity
    }, 0)

    return {
      items: cartItems.rows,
      total,
    }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function addToCart(userId: number, productId: number, quantity = 1) {
  try {
    // Check if product exists and is in stock
    const product = await db.execute(
      `SELECT * FROM products WHERE id = $1 AND is_published = true AND stock_quantity >= $2`,
      [productId, quantity],
    )

    if (!product.rows.length) {
      return { error: "Product not available or insufficient stock" }
    }

    // Check if item already exists in cart
    const existingItem = await db.execute(`SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`, [
      userId,
      productId,
    ])

    if (existingItem.rows.length) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity

      // Check if new quantity exceeds stock
      if (newQuantity > product.rows[0].stock_quantity) {
        return { error: "Cannot add more of this item (exceeds available stock)" }
      }

      const updatedItem = await db.execute(
        `UPDATE cart_items 
         SET quantity = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND product_id = $3
         RETURNING *`,
        [newQuantity, userId, productId],
      )

      return updatedItem.rows[0]
    } else {
      // Add new item
      const newItem = await db.execute(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, productId, quantity],
      )

      return newItem.rows[0]
    }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function updateCartItemQuantity(userId: number, productId: number, quantity: number) {
  try {
    // Check if product exists and is in stock
    const product = await db.execute(
      `SELECT * FROM products WHERE id = $1 AND is_published = true AND stock_quantity >= $2`,
      [productId, quantity],
    )

    if (!product.rows.length) {
      return { error: "Product not available or insufficient stock" }
    }

    const updatedItem = await db.execute(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, userId, productId],
    )

    if (!updatedItem.rows.length) {
      return { error: "Item not found in cart" }
    }

    return updatedItem.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function removeFromCart(userId: number, productId: number) {
  try {
    await db.execute(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [userId, productId])

    return { success: true }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function clearCart(userId: number) {
  try {
    await db.execute(`DELETE FROM cart_items WHERE user_id = $1`, [userId])

    return { success: true }
  } catch (error) {
    return handleDbError(error)
  }
}
