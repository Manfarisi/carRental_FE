import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import ExplainCard from '../components/ExplainCard'

const Home = () => {
  return (
    <>
      <Hero/>  
      <ExplainCard/>
      <FeaturedSection/>
      <Banner/>
      <Testimonial/>
      {/* <Newsletter/> */}
      
    </>
  )
}

export default Home