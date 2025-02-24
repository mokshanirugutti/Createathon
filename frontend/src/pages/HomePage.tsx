import ChallengesSection from '@/components/sections/ChallengesSection'
import HeroSection from '@/components/sections/HeroSection'
import React from 'react'

const HomePage : React.FC = () => {
  return (
    <div className='max-w-2xl mx-auto '
    >
      <HeroSection/>
      <ChallengesSection/>
    
    </div>
  )
}

export default HomePage