"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  price: number
  credits: number
  onConfirm: () => void
  loading: boolean
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  price,
  credits,
  onConfirm,
  loading,
}: PaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="relative max-w-md w-full bg-white p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Payment</h2>
          <p className="text-gray-600">Review your purchase details</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-700">Plan</span>
            <span className="font-bold text-gray-900">{planName}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-700">Credits</span>
            <span className="font-bold text-gray-900">{credits.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-700 text-lg">Total</span>
            <span className="font-bold text-gray-900 text-2xl">¥{price}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </Button>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outline"
            className="w-full py-3 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
