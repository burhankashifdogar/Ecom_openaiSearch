import { db, handleDbError } from "@/lib/db"

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: number | null
}

export async function getCategories() {
  try {
    const categories = await db.execute(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_published = true) as product_count
      FROM categories c
      ORDER BY c.name ASC
    `)

    return categories.rows
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await db.execute(`SELECT * FROM categories WHERE slug = $1`, [slug])

    if (!category.rows.length) {
      return null
    }

    return category.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getCategoryWithProducts(slug: string, limit = 12) {
  try {
    const category = await getCategoryBySlug(slug)

    if (!category) {
      return null
    }

    const products = await db.execute(
      `SELECT p.* FROM products p
       WHERE p.category_id = $1 AND p.is_published = true
       ORDER BY p.created_at DESC
       LIMIT $2`,
      [category.id, limit],
    )

    return {
      ...category,
      products: products.rows,
    }
  } catch (error) {
    return handleDbError(error)
  }
}
