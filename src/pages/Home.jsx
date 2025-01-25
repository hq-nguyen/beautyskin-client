import React from 'react'
import Banner from '../components/Banner/Banner'
import ProductClassification from '../components/ProductClassification/ProductClassification'
import ProductHighlights from '../components/ProductHighlights/ProductHighlights'
import DealBanner from '../components/DealBanner/DealBanner'

const Home = () => {
  return (
    <div>
      <Banner />
      <ProductClassification />
      <ProductHighlights />
      <DealBanner />
      
    </div>
  )
}

export default Home