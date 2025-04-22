import { NextRequest, NextResponse } from "next/server";
import { getRelatedProducts, getProductById, getProducts } from "@/lib/services/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const category = searchParams.get('category');
    
    let recommendations = [];
    
    if (productId) {
      const id = parseInt(productId, 10);
      recommendations = await getRelatedProducts(id, 4);
    } else if (category) {
      // Get products from the specified category
      const categoryId = parseInt(category, 10);
      const { products } = await getProducts({ 
        categoryId, 
        limit: 4,
        inStock: true
      });
      recommendations = products;
    } else {
      // Get featured products as recommendations
      const { products } = await getProducts({ 
        featured: true, 
        limit: 4,
        inStock: true
      });
      recommendations = products;
    }
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
