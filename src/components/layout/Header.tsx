import { Menu, Transition } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Fragment } from 'react';

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
            <Menu as='div' className='relative inline-block text-left'>
              <div>
                <Menu.Button className='inline-flex w-full justify-center rounded-md  p-2 text-sm font-medium text-indigo-900 ring-2 ring-indigo-900 hover:bg-white hover:text-indigo-600 hover:ring-indigo-600  focus:outline-none focus-visible:ring-indigo-700 focus-visible:ring-opacity-75'>
                  <Bars3Icon className=' h-5 w-5' aria-hidden='true' />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={`${
                          active
                            ? 'bg-indigo-700 text-white'
                            : 'text-indigo-900'
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium`}
                        href='/dashboard'
                      >
                        <HomeIcon
                          className={
                            'mr-2 h-5 w-5 ' +
                            (active ? 'text-white' : 'text-indigo-900')
                          }
                          aria-hidden='true'
                        />
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={`${
                          active
                            ? 'bg-indigo-700 text-white'
                            : 'text-indigo-900'
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium`}
                        href='/account'
                      >
                        <Cog6ToothIcon
                          className={
                            'mr-2 h-5 w-5 ' +
                            (active ? 'text-white' : 'text-indigo-900')
                          }
                          aria-hidden='true'
                        />
                        Account
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleClick}
                        className={`${
                          active
                            ? 'bg-indigo-700 text-white'
                            : 'text-indigo-900'
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium`}
                      >
                        <ArrowRightOnRectangleIcon
                          className={
                            'mr-2 h-5 w-5 ' +
                            (active ? 'text-white' : 'text-indigo-900')
                          }
                          aria-hidden='true'
                        />
                        Log Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
            // <button

            //   onClick={handleClick}
            // >
            //   Log Out
            // </button>
          )}
          {props.login && (
            <ArrowLink
              as={ButtonLink}
              className='group relative flex w-full justify-center rounded-md border-0 bg-indigo-900 p-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900'
              href='/signup'
            >
              Get Started
            </ArrowLink>
          )}
        </nav>
      </div>
    </header>
  );
}
