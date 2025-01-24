import React from 'react'
import Banner from '../components/Banner/Banner'
import ProductClassification from '../components/ProductClassification/ProductClassification'
import ProductHighlights from '../components/ProductHighlights/ProductHighlights'

const Home = () => {
  return (
    <div>
      <Banner />
      <ProductClassification />
      <ProductHighlights />
      
    </div>
  )
}

export default Home