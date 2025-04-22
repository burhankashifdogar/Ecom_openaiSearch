import { db, handleDbError } from "@/lib/db"

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  sale_price: number | null
  stock_quantity: number
  image_url: string
  category_id: number
  featured: boolean
  is_published: boolean
  created_at: Date
  updated_at: Date
}

export type ProductWithImages = Product & {
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[]
  attributes: { name: string; value: string }[]
  category: { id: number; name: string; slug: string } | null
}

export async function getProducts({
  featured = false,
  limit = 10,
  offset = 0,
  categoryId = null,
  search = null,
  minPrice = null,
  maxPrice = null,
  inStock = false,
}: {
  featured?: boolean
  limit?: number
  offset?: number
  categoryId?: number | null
  search?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  inStock?: boolean
}) {
  try {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_published = true
    `

    const params: any[] = []
    let paramIndex = 1

    if (featured) {
      query += ` AND p.featured = true`
    }

    if (categoryId) {
      query += ` AND p.category_id = $${paramIndex}`
      params.push(categoryId)
      paramIndex++
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (minPrice !== null) {
      query += ` AND p.price >= $${paramIndex}`
      params.push(minPrice)
      paramIndex++
    }

    if (maxPrice !== null) {
      query += ` AND p.price <= $${paramIndex}`
      params.push(maxPrice)
      paramIndex++
    }

    if (inStock) {
      query += ` AND p.stock_quantity > 0`
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const products = await db.execute(query, params)

    // Get images for each product
    const productsWithImages = await Promise.all(
      products.rows.map(async (product: any) => {
        const images = await db.execute(`SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC`, [
          product.id,
        ])

        const attributes = await db.execute(`SELECT name, value FROM product_attributes WHERE product_id = $1`, [
          product.id,
        ])

        return {
          ...product,
          images: images.rows,
          attributes: attributes.rows,
          category: product.category_name
            ? {
                id: product.category_id,
                name: product.category_name,
                slug: product.category_slug,
              }
            : null,
        }
      }),
    )

    // Get total count for pagination
    const countResult = await db.execute(
      `
      SELECT COUNT(*) as total
      FROM products p
      WHERE p.is_published = true
      ${featured ? "AND p.featured = true" : ""}
      ${categoryId ? "AND p.category_id = $1" : ""}
    `,
      categoryId ? [categoryId] : [],
    )

    return {
      products: productsWithImages,
      total: Number.parseInt(countResult.rows[0].total),
    }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getProductById(id: number) {
  try {
    const product = await db.execute(`SELECT * FROM products WHERE id = $1 AND is_published = true`, [id])

    if (!product.rows.length) {
      return null
    }

    const images = await db.execute(`SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC`, [id])

    const attributes = await db.execute(`SELECT name, value FROM product_attributes WHERE product_id = $1`, [id])

    const category = await db.execute(`SELECT id, name, slug FROM categories WHERE id = $1`, [
      product.rows[0].category_id,
    ])

    return {
      ...product.rows[0],
      images: images.rows,
      attributes: attributes.rows,
      category: category.rows.length ? category.rows[0] : null,
    }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.execute(`SELECT * FROM products WHERE slug = $1 AND is_published = true`, [slug])

    if (!product.rows.length) {
      return null
    }

    const productId = product.rows[0].id

    const images = await db.execute(`SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC`, [
      productId,
    ])

    const attributes = await db.execute(`SELECT name, value FROM product_attributes WHERE product_id = $1`, [productId])

    const category = await db.execute(`SELECT id, name, slug FROM categories WHERE id = $1`, [
      product.rows[0].category_id,
    ])

    return {
      ...product.rows[0],
      images: images.rows,
      attributes: attributes.rows,
      category: category.rows.length ? category.rows[0] : null,
    }
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getRelatedProducts(productId: number, limit = 4) {
  try {
    const product = await db.execute(`SELECT category_id FROM products WHERE id = $1`, [productId])

    if (!product.rows.length) {
      return []
    }

    const categoryId = product.rows[0].category_id

    const relatedProducts = await db.execute(
      `SELECT p.* FROM products p
       WHERE p.category_id = $1 AND p.id != $2 AND p.is_published = true
       ORDER BY p.created_at DESC
       LIMIT $3`,
      [categoryId, productId, limit],
    )

    return relatedProducts.rows
  } catch (error) {
    return handleDbError(error)
  }
}

export async function searchProducts(query: string, limit = 10) {
  try {
    const products = await db.execute(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_published = true AND (
         p.name ILIKE $1 OR
         p.description ILIKE $1 OR
         c.name ILIKE $1
       )
       ORDER BY p.created_at DESC
       LIMIT $2`,
      [`%${query}%`, limit],
    )

    return products.rows
  } catch (error) {
    return handleDbError(error)
  }
}
