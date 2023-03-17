import Link from 'next/link';
import * as React from 'react';

import NextImage from '@/components/NextImage';

export default function TrialCard({
  link,
  image,
}: {
  link: string;
  image: string;
}) {
  return (
    <div className='flex flex-col items-center space-y-3'>
      <NextImage
        useSkeleton
        className='max-w-1/2 aspect-[2/1] h-8'
        src={image}
        width='180'
        height='180'
        alt='Icon'
      />
      <Link
        type='submit'
        className='group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        href={link}
        target='_blank'
      >
        Get for free
      </Link>
    </div>
  );
}
