import * as React from 'react';

import Header from './Header';

export default function Layout({
  children,
  logout,
  login,
}: {
  children: React.ReactNode;
  logout?: boolean;
  login?: boolean;
}) {
  // Put Header or Footer Here
  return (
    <>
      <Header logout={logout} login={login} />
      {children}
    </>
  );
}
