import { useState, useCallback } from 'react';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Razorpay Script dynamically
  const loadScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsLoaded(true);
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  const initPayment = async ({
    amount, // In rupees (e.g., 199)
    name = 'HabitFlow',
    description = 'Pro Plan Upgrade',
    prefill = { name: '', email: '', contact: '' },
    onSuccess,
    onError
  }) => {
    if (!RAZORPAY_KEY_ID) {
      const error = new Error('Razorpay is not configured. Set VITE_RAZORPAY_KEY_ID for production.');
      if (onError) onError(error);
      return;
    }

    const res = await loadScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      if (onError) onError(new Error('SDK failed to load'));
      return;
    }

    // Amount needs to be in paise for Razorpay
    const amountInPaise = amount * 100;

    const options = {
      key: RAZORPAY_KEY_ID, 
      amount: amountInPaise.toString(),
      currency: 'INR',
      name: name,
      description: description,
      image: 'https://cdn-icons-png.flaticon.com/512/1055/1055661.png',
      handler: function (response) {
        // This function is called on successful payment
        // response.razorpay_payment_id will be available
        if (onSuccess) onSuccess(response);
      },
      prefill: prefill,
      theme: {
        color: '#534AB7',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      if (onError) onError(response.error);
    });
    
    paymentObject.open();
  };

  return { initPayment, isLoaded, loadScript };
};
