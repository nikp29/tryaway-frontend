import * as React from 'react';

import NextImage from '@/components/NextImage';

import Header from './Header';

export default function Layout({
  children,
  logout,
  login,
  loading,
}: {
  children: React.ReactNode;
  logout?: boolean;
  login?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading?: any | undefined;
}) {
  // Put Header or Footer Here
  if (!loading) {
    return (
      <>
        <Header logout={logout} login={login} />
        {children}
      </>
    );
  } else
    return (
      <section className='flex flex-grow flex-col items-center justify-center'>
        <NextImage
          className='aspect-square w-64'
          src='svg/loading.svg'
          width='256'
          height={256}
          alt='Icon'
        />
      </section>
    );
}
