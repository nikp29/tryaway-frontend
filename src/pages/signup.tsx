// !STARTERCONF You can delete this page
import { LockClosedIcon } from '@heroicons/react/20/solid';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';

import { app } from '@/lib/firebase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user && !submit) {
      router.push('/dashboard');
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmit(true);

    if (password !== confirmPassword) {
      alert('Passwords do not match');
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
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          <div>
            {/* <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            /> */}
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              Sign up for a new account
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Or{' '}
              <Link
                href='/signup'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                sign in
              </Link>
            </p>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-3 rounded-md shadow-sm'>
              <div>
                <label htmlFor='email-address' className='sr-only'>
                  Email address
                </label>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Email address'
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Password'
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Confirm Password
                </label>
                <input
                  id='confirm-password'
                  name='confirm-password'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete='new-password'
                  required
                  className='relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Confirm Password'
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='text-sm'>
                By creating an account, you agree to the terms and conditions
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <LockClosedIcon
                    className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                    aria-hidden='true'
                  />
                </span>
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
