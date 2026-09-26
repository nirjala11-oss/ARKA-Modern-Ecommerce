import { NextRequest } from 'next/server'
import { usersDb } from '@/lib/users-store'
import { getAllProducts } from '@/lib/products-service'
import { requireRole } from '@/lib/security/auth-guard'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // Only admins can access seller registries and financial valuation telemetry
    requireRole(request, ['admin'])

    const sellers = await usersDb.getAllSellers()
    const allProducts = await getAllProducts()

    const sellersWithMetrics = sellers.map((seller) => {
      const sellerProds = allProducts.filter((p) => p.sellerId === seller.id || p.sellerName === seller.storeName)
      const totalUnits = sellerProds.reduce((sum, p) => sum + (p.stock || 0), 0)
      const totalValuation = sellerProds.reduce((sum, p) => sum + (p.price * (p.stock || 1)), 0)

      return {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        storeName: seller.storeName || `${seller.name}'s Boutique`,
        activeListings: sellerProds.length,
        totalInventoryUnits: totalUnits,
        catalogValuation: totalValuation,
        verified: true,
        joinedDate: '2025-01-15',
      }
    })

    return apiSuccess({
      sellers: sellersWithMetrics,
    })
  } catch (error) {
    return apiError(error)
  }
}
