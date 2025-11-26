'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Order Successful!
            </h1>

            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>

            <div className="space-y-3">
              <Button
                variant="cta"
                className="w-full"
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
