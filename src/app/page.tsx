import React from 'react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white space-y-8'>
      <h1 className='text-3xl md:text-5xl font-bold tracking-wide text-center animate-pulse'>
        Make Your Voice Heard
      </h1>
      <Link href="/vote">
        <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105'>
          Vote
        </button>
      </Link>
    </div>
  )
}

export default Page
