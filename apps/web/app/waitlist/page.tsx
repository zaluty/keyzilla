'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WaitlistPage() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto mt-10 shadow-lg rounded-lg overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle>Waitlist</CardTitle>
        </CardHeader>
        <CardContent className="bg-gray-100 text-center p-5 text-gray-800">
          Congratulations! You are now on the waitlist. We will notify you when the product is ready. 
        </CardContent>
      </Card>
    </div>
  )
}