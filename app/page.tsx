import { prisma } from "@/lib/prisma"
import Navbar from './components/Navbar'
import { ProductGrid } from './components/ProductGrid'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      status: 'active'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <div className="flex flex-col items-center space-y-4 mb-8 md:mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome to Aaltoes Brand Store
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Start by browsing our products
          </p>
        </div>
        
        <ProductGrid products={products} />
      </main>
    </>
  )
}
