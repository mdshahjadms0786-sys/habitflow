import { useState, useCallback } from 'react'
import { callEdgeFunction } from '../services/edgeFunctions'
import toast from 'react-hot-toast'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const loadScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsLoaded(true)
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        setIsLoaded(true)
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const initPayment = async ({
    amount,
    name = 'HabitFlow',
    description = 'Pro Plan Upgrade',
    prefill = { name: '', email: '', contact: '' },
    onSuccess,
    onError,
  }) => {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      toast.error('Payment integration coming soon!')
      return
    }

    const res = await loadScript()
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      if (onError) onError(new Error('SDK failed to load'))
      return
    }

    const amountInPaise = amount * 100

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise.toString(),
      currency: 'INR',
      name,
      description,
      image: 'https://cdn-icons-png.flaticon.com/512/1055/1055661.png',
      handler: async function (response) {
        setIsVerifying(true)
        try {
          const result = await callEdgeFunction('verify-payment', {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            plan: description.toLowerCase().includes('elite') ? 'elite' : 'pro',
            amount,
          })

          if (result.error) {
            if (onError) onError(new Error(result.error))
            return
          }

          if (onSuccess) onSuccess(result.data)
        } catch (err) {
          if (onError) onError(err)
        } finally {
          setIsVerifying(false)
        }
      },
      prefill,
      theme: { color: '#534AB7' },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.on('payment.failed', function (response) {
      setIsVerifying(false)
      if (onError) onError(response.error)
    })

    paymentObject.open()
  }

  return { initPayment, isLoaded, loadScript, isVerifying }
}
