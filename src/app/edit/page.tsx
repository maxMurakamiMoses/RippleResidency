// app/your-route/page.jsx

import React from 'react'
import Link from 'next/link'
import ElectionDashboard from '@/components/Edit/ElectionDashboard'

const Page = () => {
  return (
    <div >
    <div className='pl-36 pt-20'>
      <Link href="/" passHref legacyBehavior>
        <a
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            textDecoration: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Return
        </a>
      </Link>
      </div>
      
      {/* Election Dashboard */}
      <ElectionDashboard />
    </div>
  )
}

export default Page
