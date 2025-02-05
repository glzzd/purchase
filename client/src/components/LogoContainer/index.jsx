import React from 'react'

const Logo = ({logoUrl}) => {
  return (
    <div className='flex justify-center items-center'>
    <img src={logoUrl} alt="XRITDX" className='h-[100px]'/>
  </div>
  )
}

export default Logo