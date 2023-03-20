/* eslint-disable @typescript-eslint/no-explicit-any */
// !STARTERCONF You can delete this page
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';

import { app } from '@/lib/firebase';
import { callBackEnd } from '@/lib/helper';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const jwt = await userCredential.user.getIdToken();

      const { hasPaid } = await callBackEnd('userhaspaid', 'GET', jwt);
      if (!hasPaid) {
        const { subscriptionId, clientSecret } = await callBackEnd(
          'updatesubscription',
          'POST',
          jwt
        );
        router.push({
          pathname: '/paywithstripe',
          query: { subscriptionId, clientSecret, expired: true },
        });
      } else {
        router.push({ pathname: '/dashboard' });
      }
    } catch (error: any) {
      if (error && error.message) {
        if (error.message.includes('Firebase')) {
          setError('Invalid email or password');
        } else {
          setError('Unkown error, please try again');
        }
      }
      setIsSubmitting(false);
    }
  };

  return (
    <main className=" flex min-h-screen w-screen flex-col bg-[url('/images/Tryawaybackground.png')] bg-cover">
      <Layout loading={!(router && auth)}>
        <section className='flex flex-grow flex-col items-center justify-center'>
          <div className='container flex max-w-md flex-col space-y-4 rounded-md bg-white p-6 shadow-xl'>
            <p className='text-2xl font-bold text-gray-800'> Sign In</p>
            <div>
              <Link
                href='/signup'
                className='text-sm font-medium text-indigo-700 hover:text-indigo-500'
              >
                I don't have an account
              </Link>
            </div>

            <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
              {/* <input type='hidden' name='remember' defaultValue='true' /> */}
              <div className=' flex flex-col'>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Email address'
                />
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={
                    'relative mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' +
                    (error
                      ? ' z-10 ring-2 ring-inset ring-red-600 focus:ring-red-600'
                      : ' focus:ring-indigo-600')
                  }
                  placeholder='Password'
                />
                {error && (
                  <p className='mt-1 -mb-2 text-xs text-red-700'>{error}</p>
                )}
              </div>
              <Link
                href='#'
                className='text-sm font-medium text-indigo-700 hover:text-indigo-500'
              >
                I forgot my password
              </Link>

              <div>
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
                    <p className='py-2'>Sign In</p>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
        <Seo />
      </Layout>
    </main>
  );
}
