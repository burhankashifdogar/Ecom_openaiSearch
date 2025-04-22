import { db, handleDbError } from "@/lib/db"
import { hash, compare } from "bcrypt"

export type User = {
  id: number
  name: string
  email: string
  role: string
  created_at: Date
  updated_at: Date
}

export async function getUserById(id: number) {
  try {
    const user = await db.execute(`SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`, [id])

    if (!user.rows.length) {
      return null
    }

    return user.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.execute(`SELECT * FROM users WHERE email = $1`, [email])

    if (!user.rows.length) {
      return null
    }

    return user.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: string
}) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash the password
    const passwordHash = await hash(userData.password, 10)

    // Create the user
    const user = await db.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, updated_at`,
      [userData.name, userData.email, passwordHash, userData.role || "customer"],
    )

    return user.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function updateUser(
  id: number,
  userData: {
    name?: string
    email?: string
    password?: string
  },
) {
  try {
    let query = `UPDATE users SET updated_at = CURRENT_TIMESTAMP`
    const params: any[] = []
    let paramIndex = 1

    if (userData.name) {
      query += `, name = $${paramIndex}`
      params.push(userData.name)
      paramIndex++
    }

    if (userData.email) {
      query += `, email = $${paramIndex}`
      params.push(userData.email)
      paramIndex++
    }

    if (userData.password) {
      const passwordHash = await hash(userData.password, 10)
      query += `, password_hash = $${paramIndex}`
      params.push(passwordHash)
      paramIndex++
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, name, email, role, created_at, updated_at`
    params.push(id)

    const user = await db.execute(query, params)

    if (!user.rows.length) {
      return null
    }

    return user.rows[0]
  } catch (error) {
    return handleDbError(error)
  }
}

export async function verifyUserCredentials(email: string, password: string) {
  try {
    const user = await db.execute(`SELECT * FROM users WHERE email = $1`, [email])

    if (!user.rows.length) {
      return null
    }

    const isValidPassword = await compare(password, user.rows[0].password_hash)

    if (!isValidPassword) {
      return null
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user.rows[0]
    return userWithoutPassword
  } catch (error) {
    return handleDbError(error)
  }
}

export async function getUserAddresses(userId: number) {
  try {
    const addresses = await db.execute(`SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC`, [
      userId,
    ])

    return addresses.rows
  } catch (error) {
    return handleDbError(error)
  }
}
