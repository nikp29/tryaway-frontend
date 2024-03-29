// !STARTERCONF You can delete this page
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { app } from '@/lib/firebase';
import { callBackEnd } from '@/lib/helper';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

export default function ComponentsPage() {
  loadStripe;
  const router = useRouter();
  const clientSecret = router.query.clientSecret;
  const [name, setName] = useState('');
  const [idToken, setIdToken] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setIdToken(idToken);

        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  });

  const auth = getAuth(app);

  const [message, setMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    if (!name || !streetAddress || !city || !state || !zip) {
      setMessage('Please fill out all fields');
      setIsSubmitting(false);
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements?.getElement(CardElement);

    if (stripe && elements && typeof clientSecret === 'string' && cardElement) {
      // Use card Element to tokenize payment details
      try {
        await callBackEnd('setAddress', 'POST', idToken, {
          address: {
            name,
            streetAddress,
            city,
            state,
            zip,
          },
        });
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
          setMessage(paymentIntent.error.message as string);
          setIsSubmitting(false);
        }
      } catch (error) {
        console.log(error);
        setMessage(
          'Error processing payment. Please check card details and try again.'
        );
        setIsSubmitting(false);
      }
    }
  };

  if (paymentStatus === 'succeeded') {
    router.push({
      pathname: '/dashboard',
    });
  }

  return (
    <main className=" flex min-h-screen flex-col bg-[url('/images/Tryawaybackground.png')] bg-cover">
      <Layout
        loading={
          !(stripe && elements && typeof clientSecret === 'string' && idToken)
        }
      >
        <Seo
          templateTitle='Components'
          description='Pre-built components with awesome default'
        />
        <section className='flex flex-grow flex-col items-center justify-center'>
          <div className='container flex max-w-lg flex-col space-y-4 '>
            <p className='py-4 text-4xl font-bold text-gray-800'>
              Payment Method
            </p>
            <div className='container flex  flex-col  space-y-2 rounded-md bg-white p-6 shadow-xl'>
              <p className='text-sm font-bold text-gray-500'>ORDER SUMMARY</p>
              <div className='container flex flex-row justify-between'>
                <p className='text-base text-gray-500'>Basic Plan</p>
                <p className='text-base text-gray-500'>$3/mo</p>
              </div>
            </div>
            <div className='container flex  flex-col  rounded-md bg-white p-6 shadow-xl'>
              <form
                onSubmit={handleSubmit}
                className='container flex flex-col space-y-4'
              >
                <div className='container flex flex-col'>
                  <p className='mb-1 text-sm font-bold text-gray-800'>Name</p>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    autoComplete='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Full name'
                    className='relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
                <div className='container flex flex-col'>
                  <p className='mb-1 text-sm font-bold text-gray-800'>
                    Card Info
                  </p>
                  <div className='relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <CardElement
                      options={{
                        hidePostalCode: true,
                        value: { postalCode: zip },
                      }}
                    />
                  </div>
                </div>

                <div className='container flex flex-col'>
                  <p className='mb-1 text-sm font-bold text-gray-800'>
                    Street address
                  </p>
                  <input
                    type='text'
                    name='street-address'
                    id='street-address'
                    autoComplete='street-address'
                    value={streetAddress}
                    onChange={(e) => {
                      setStreetAddress(e.target.value);
                    }}
                    placeholder='Street address'
                    className='relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm '
                  />
                </div>
                <div className='container flex flex-row space-x-2'>
                  <div className='container flex flex-col'>
                    <p className='mb-1 text-sm font-bold text-gray-800'>City</p>
                    <input
                      type='text'
                      name='city'
                      id='city'
                      autoComplete='address-level2'
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      placeholder='City'
                      className='relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm '
                    />
                  </div>

                  <div className='container flex flex-col'>
                    <p className='mb-1 text-sm font-bold text-gray-800'>
                      State
                    </p>
                    <input
                      type='text'
                      name='region'
                      id='region'
                      autoComplete='address-level1'
                      placeholder='State'
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                      }}
                      className='relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>

                  <div className='container flex flex-col'>
                    <p className='mb-1 text-sm font-bold text-gray-800'>ZIP</p>
                    <input
                      type='text'
                      name='postal-code'
                      id='postal-code'
                      autoComplete='postal-code'
                      placeholder='ZIP'
                      value={zip}
                      onChange={(e) => {
                        setZip(e.target.value);
                      }}
                      className='relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
                {message && (
                  <div className='container -mb-2 flex flex-col'>
                    <p className=' text-sm text-red-700'>{message}</p>
                  </div>
                )}

                <button
                  type='submit'
                  className='flex w-full flex-row items-center justify-center space-x-4 rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <NextImage
                        className='w-10'
                        src='svg/loadingWhite.svg'
                        width='256'
                        height='128'
                        alt='Icon'
                      />{' '}
                      <p>{'  '}</p>
                    </>
                  ) : (
                    <p className='py-2'>Subscribe</p>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    </main>
  );
}
