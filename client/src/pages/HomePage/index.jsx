import React from 'react'

import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'

const HomePage = () => {
  return (
    <div className='flex flex-col'>
        <Navbar/>
        <Hero/>
    </div>
  )
}

export default HomePage