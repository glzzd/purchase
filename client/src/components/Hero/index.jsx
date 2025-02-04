import React from 'react'

const Hero = () => {
  return (
    <div className='flex flex-col py-5 px-10'>
        <span className='text-xl font-bold text-center'>Azərbaycan Respublikası <br /> Xüsusi Rabitə və İnformasiya Təhlükəsizliyi <br /> Dövlət Xidməti</span>
        <span className='text-3xl font-bold text-center py-10'>Elektron İdarəetmə Sistemi</span>
        
        <div className='flex justify-center py-10'>
            <img src="./dashboard.png" alt="" className='w-200'/>
        </div>
        <span className='text-sm text-center py-10'>Elektron Xidmətlərin Təşkili Şöbəsi</span>
    </div>
  )
}

export default Hero