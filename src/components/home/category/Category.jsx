import React from 'react'
import CategorySlider from './CategorySlider'
import { ShoppingBag } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import Link from 'next/link'

const Category = () => {
    return (
        <section className='my-20'>
            <div className='flex justify-between mx-4 md:mx-16 items-center mb-8'>
                <div className='flex gap-3 items-center'>
                    <div className='bg-green-50 p-2 rounded-lg'>
                        <ShoppingBag className='text-green-700' size={20} strokeWidth={2.5} />
                    </div>
                    <h2 className='font-bold text-xl md:text-2xl text-green-700'>Shop by Category</h2>
                </div>
                <Button className="hidden md:block">View All Items</Button>
            </div>

            <CategorySlider />

            <div className='md:hidden flex justify-center mt-6'>
                <Button className='cursor-pointer'>
                    <Link href="./shop">
                        View All Items
                    </Link>
                </Button>
            </div>
        </section>
    )
}

export default Category