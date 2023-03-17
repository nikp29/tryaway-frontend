/* eslint-disable @typescript-eslint/no-explicit-any */
// !STARTERCONF You can delete this page
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';

import { app } from '@/lib/firebase';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPassProblem, setIsPassProblem] = useState(false);
  const [isEmailProblem, setIsEmailProblem] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPassProblem(false);
    setIsEmailProblem(false);
    if (password.length < 8) {
      setIsPassProblem(true);
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setIsPassProblem(true);
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const jwt = await userCredential.user.getIdToken();
      const res = await fetch('http://localhost:4242/v1/signup', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + jwt,
        },
      });
      const { subscriptionId, clientSecret } = await res.json();
      router.push({
        pathname: '/paywithstripe',
        query: { subscriptionId, clientSecret },
      });
    } catch (error: any) {
      if (error && error.message) {
        if (error.message.includes('email-already-in-use')) {
          setError('Email already in use');
          setIsEmailProblem(true);
        } else {
          setError('Unkown error, please try again');
        }
      }
    }
  };
  return (
    <main className=" flex min-h-screen flex-col bg-[url('/images/Tryawaybackground.png')] bg-cover">
      <Layout>
        <section className='flex flex-grow flex-col items-center justify-center'>
          <div className='container flex max-w-md flex-col space-y-4 rounded-md bg-white p-6 shadow-xl'>
            <p className='text-2xl font-bold text-gray-800'> Sign Up</p>
            <div>
              <Link
                href='/signin'
                className='text-sm font-medium text-indigo-700 hover:text-indigo-500'
              >
                I have an account
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
                  className={
                    'relative mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' +
                    (error && isEmailProblem
                      ? ' z-10 ring-2 ring-inset ring-red-600 focus:ring-red-600'
                      : ' focus:ring-indigo-600')
                  }
                  placeholder='Email address'
                />
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={
                    'relative mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' +
                    (error && isPassProblem
                      ? ' z-10 ring-2 ring-inset ring-red-600 focus:ring-red-600'
                      : ' focus:ring-indigo-600')
                  }
                  placeholder='Password'
                />
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={
                    'relative mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' +
                    (error && isPassProblem
                      ? ' z-10 ring-2 ring-inset ring-red-600 focus:ring-red-600'
                      : ' focus:ring-indigo-600')
                  }
                  placeholder='Confirm Password'
                />
                {error ? (
                  <p className='mt-1 text-xs text-red-700'>{error}</p>
                ) : (
                  <p className='mt-1 text-xs text-gray-500'>
                    Use 8 characters or more
                  </p>
                )}
              </div>

              <div>
                <button
                  type='submit'
                  className='group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Sign in
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
