import React from 'react'
import Banner from '../components/Banner/Banner'
import ProductClassification from '../components/ProductClassification/ProductClassification'
import ProductHighlights from '../components/ProductHighlights/ProductHighlights'
import DealBanner from '../components/DealBanner/DealBanner'
import News from '../components/News/News'
import FAQSection from '../components/FAQSection/FAQSection'

const Home = () => {
  return (
    <div>
      <Banner />
      <ProductClassification />
      <ProductHighlights />
      <DealBanner />
      <News />
      <FAQSection />
      
    </div>
  )
}

export default Home