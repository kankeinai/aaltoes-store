import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Navbar from "@/app/components/Navbar"
import { CartItems } from "./components/CartItems"
import { ArrowLeft } from "@geist-ui/icons"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Loading from "@/app/cart/loading"

// Add caching and optimization configs
export const revalidate = 10 // Revalidate every 10 seconds
export const dynamic = 'force-dynamic'
export const preferredRegion = 'fra1'

async function getCartItems(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: { user_id: userId },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          cartId: true,
          productId: true,
          quantity: true,
          size: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              type: true,
              status: true
            }
          }
        }
      }
    }
  })

  if (!cart?.items.length) {
    return []
  }

  return cart.items.map(item => ({
    ...item,
    total: item.quantity * item.product.price
  }))
}

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/")
  }

  const cartItems = await getCartItems(session.user.id)

  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Cart</h1>
          </div>
          <div className="flex justify-between mb-8">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-muted-foreground"
              )}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Store
            </Link>
          </div>
          <div className="bg-card rounded-lg border shadow-sm">
            <CartItems items={cartItems} />
          </div>

          <div className="text-sm text-muted-foreground text-center mt-6">
            <p>
              Need help?{" "}
              <a 
                href="mailto:board@aaltoes.com?subject=Aaltoes%20Store%20Support%20Request" 
                className="text-primary hover:underline"
              >
                Contact us at board@aaltoes.com
              </a>
            </p>
          </div>
        </main>
      </Suspense>
    </>
  )
} 