// Mock database implementation for development
const mockDb = {
  // Flag to indicate we're using mock data
  isMock: true,

  // Execute SQL queries (mock implementation)
  async query(sql: string, params: any[] = []) {
    console.warn("Using mock database - SQL query:", sql)
    return { rows: [] }
  },
}

// Export the mock database
export const db = mockDb

// Export a tagged template function that mimics the neon SQL interface
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  console.warn("Using mock database - SQL template:", strings.join("?"))
  return []
}

// Log that we're using mock data
console.warn("⚠️ Using mock database implementation. Connect to a real database for production use.")
