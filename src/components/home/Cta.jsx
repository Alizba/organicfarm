import React from 'react'
import Image from 'next/image'

const Cta = () => {
  return (
    <>
    <div className=' h-svh relative my-10'>
        <div className='absolute inset-0 bg-[url(/images/ctaBackGround.jpg)] bg-cover'></div>
        <div className='relative'>
            <div>
                <Image
                src="/images/cta.png"
                alt='img'
                width={300}
                height={300}
                />
            </div>
            <div>
                right
            </div>
        </div>
    </div>
    </>
  )
}

export default Cta