import React from 'react'
import {motion} from 'framer-motion'

const HeroSection : React.FC = () => {
  return (
    <div className='w-full flex gap-2 py-10 mt-20 justify-around'>

    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5}}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Master Coding Challenges</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Sharpen your Python skills with our interactive platform
            </p>
    </motion.div>

    </div>
  )
}

export default HeroSection