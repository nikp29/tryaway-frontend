// !STARTERCONF You can delete this page
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as React from 'react';

import { app } from '@/lib/firebase';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import TrialCard from '@/components/TrialCard';

export default function ComponentsPage() {
  const router = useRouter();
  const [routeHome, setRouteHome] = useState(false);
  useEffect(() => {
    // Update the document title using the browser API
    if (routeHome) {
      router.push('/');
    }
  });

  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      // ...
    } else {
      // User is signed out
      // ...
      setRouteHome(true);
    }
  });

  const user = auth.currentUser;
  console.log(user?.email);

  return (
    <main className=" flex min-h-screen flex-col bg-[url('/images/Tryawaybackground.png')] bg-cover">
      <Layout logout={true}>
        <Seo
          templateTitle='Components'
          description='Pre-built components with awesome default'
        />
        <section className='flex flex-grow flex-col items-center justify-center'>
          <div className='container flex max-w-prose flex-col space-y-4 rounded-md bg-white p-6 shadow-xl'>
            <p className='text-2xl font-bold text-gray-800'>You’re all set!</p>
            <p className='text-sm  text-gray-600'>
              Once you visit the sign-up/payment screen of a website for a
              service with a free trial, our Chrome extension should pop up with
              a button to autofill your newly generated information so you can
              get unlimited free trials.
            </p>
            <p className='text-lg font-bold text-gray-500'>
              Start with these services:
            </p>
            <div className='grid grid-flow-row grid-cols-3 gap-8'>
              <TrialCard
                image='/images/hulu.png'
                link='https://www.hulu.com/start'
              />
              <TrialCard
                image='/images/hbomax.png'
                link='https://www.hulu.com/start'
              />
              <TrialCard
                image='/images/mubi.png'
                link='https://mubi.com/t/web/global/3qxuxj2'
              />
              <TrialCard
                image='/images/prime.png'
                link='https://www.amazon.com/gp/prime/pipeline/signup?ie=UTF8&primeCampaignId=primeMobileSignupWhite&renderingType=mobile&showLandingPage=1'
              />
              <TrialCard
                image='/images/showtime.png'
                link='https://www.showtime.com/getShowtime'
              />
              <TrialCard
                image='/images/spotify.png'
                link='https://www.spotify.com/us/premium/?utm_source=us-en_brand_contextual_text&utm_medium=paidsearch&utm_campaign=alwayson_ucanz_us_performancemarketing_highsubintent_brand+contextual+text+exact+us-en+google&gclid=EAIaIQobChMIiZjsi-fh_QIVNCqtBh1wTAGUEAAYASAAEgJACPD_BwE&gclsrc=aw.ds'
              />
            </div>
          </div>
        </section>
      </Layout>
    </main>
  );
}
