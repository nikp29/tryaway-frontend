import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import * as React from 'react';

import { app } from '@/lib/firebase';

import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header(props: { logout?: boolean; login?: boolean }) {
  const router = useRouter();
  const auth = getAuth(app);
  const handleClick = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    signOut(auth);
    router.push('/');
  };

  return (
    <header className='bg-clear sticky top-0 z-50 pt-2'>
      <div className='layout flex items-center justify-between text-2xl font-extrabold text-indigo-900'>
        <UnstyledLink href='/' className='font-bold hover:text-indigo-700'>
          Tryaway
        </UnstyledLink>
        <nav>
          {props.logout && (
            <button
              className='group relative flex w-full justify-center rounded-md bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={handleClick}
            >
              Log Out
            </button>
          )}
          {props.login && (
            <ArrowLink
              as={ButtonLink}
              className='group relative flex w-full justify-center rounded-md border-0 bg-indigo-900 p-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900'
              href='/Get Started'
            >
              Log In
            </ArrowLink>
          )}
        </nav>
      </div>
    </header>
  );
}
