import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import News from '@/components/News'
import LeagueTable from '@/components/LeagueTable'
import PrelineScript from '@/components/PrelineScript'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LeagueProvider } from '@/context/LeagueContext'





const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Football Oracle',
  description: 'Prediction website created by Swift',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body
        className={`${inter.className} bg-cover bg-center`}>
        <main className="px-2 md:py-2 text-textPrimary">
          <Navbar />
          <ToastContainer />
          <LeagueProvider>
            <section className="">
              <Sidebar />
              {children}
            </section>
          </LeagueProvider>
        </main>
        <PrelineScript />
      </body>
    </html>
  );
}
