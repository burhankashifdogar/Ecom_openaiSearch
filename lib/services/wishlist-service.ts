import { db, handleDbError } from "@/lib/db"

export type WishlistItem = {
  id: number
  user_id: number
  product_id: number
  created_at: Date
  product_name: string
  product_price: number
  product_image: string
  product_category: string
  in_stock: boolean
}

export async function getUserWishlist(userId: number) {
  try {
    const wishlistItems = await db.execute(
      `SELECT w.*, p.name as product_name, p.price as product_price, 
              c.name as product_category, p.stock_quantity > 0 as in_stock,
              pi.image_url as product_image
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId],
    )

    return wishlistItems.rows
  } catch (error) {
    return handleDbError(error)
  }
}

export async function addToWishlist(userId: number, productId: number) {
  try {
    // Check if product exists
    const product = await db.execute(`SELECT * FROM products WHERE id = $1 AND is_published = true`, [productId])

    if (!product.rows.length) {
      return { error: "Product not found" }
    }

    // Check if already in wishlist
    const existingItem = await db.execute(`SELECT * FROM wishlists WHERE user_id = $1 AND product_id = $2`, [
      userId,
      productId,
    ])

    if (existingItem.rows.length) {
      return { message: "Product already in wishlist" }
    }

    // Add to wishlist
    const wishlistItem = await db.execute(
      `INSERT INTO wishlists (user_id, product_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, productId],
    )

    return wishlistItem.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function removeFromWishlist(userId: number, productId: number) {
  try {
    await db.execute(`DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2`, [userId, productId])

    return { success: true }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function isInWishlist(userId: number, productId: number) {
  try {
    const result = await db.execute(
      `SELECT EXISTS(SELECT 1 FROM wishlists WHERE user_id = $1 AND product_id = $2) as exists`,
      [userId, productId],
    )

    return result.rows[0].exists
  } catch (error) {
    return handleDbError(error)
  }
}
