// !STARTERCONF You can delete this page
import {
  AddressElement,
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

type Color = (typeof colorList)[number];

export default function ComponentsPage() {
  loadStripe;
  const router = useRouter();
  const clientSecret = router.query.clientSecret;
  const [name, setName] = useState('');
  const [address, setAddress] = useState({});
  const [messages, _setMessages] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  // helper for displaying status messages.
  const setMessage = (message: any) => {
    _setMessages(`${messages}\n\n${message}`);
  };

  // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = async (e: React.SyntheticEvent) => {
    console.log('submitting');

    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements?.getElement(CardElement);
    if (stripe && elements && typeof clientSecret === 'string' && cardElement) {
      // Use card Element to tokenize payment details
      const paymentIntent = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
          },
        },
      });

      if (paymentIntent.paymentIntent) {
        // show error and collect new card details.
        setPaymentStatus(paymentIntent.paymentIntent.status);
      } else {
        setMessage(paymentIntent.error.message);
      }
    }
  };

  if (paymentStatus === 'succeeded') {
    router.push({
      pathname: '/dashboard',
    });
  }

  return (
    <Layout>
      <Seo
        templateTitle='Components'
        description='Pre-built components with awesome default'
      />

      <main>
        <form onSubmit={handleSubmit}>
          <CardElement />
          <AddressElement
            options={{ mode: 'billing' }}
            onChange={(event) => {
              if (event.complete) {
                // Extract potentially complete address
                setAddress(event.value.address);
              }
            }}
          />

          <button
            type='submit'
            className={!stripe || !elements ? 'isLoading' : ''}
          >
            Subscribe
          </button>

          <div>{messages}</div>
        </form>
      </main>
    </Layout>
  );
}

const colorList = [
  'rose',
  'pink',
  'fuchsia',
  'purple',
  'violet',
  'indigo',
  'blue',
  'sky',
  'cyan',
  'teal',
  'emerald',
  'green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'red',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
] as const;
