import Banner from '../components/Banner/Banner'
import ProductClassification from '../components/ProductClassification/ProductClassification'
import ProductHighlights from '../components/ProductHighlights/ProductHighlights'
import DealBanner from '../components/DealBanner/DealBanner'
import News from '../components/News/News'
import FAQSection from '../components/FAQSection/FAQSection'
import Blog from '../components/Blog/Blog'
import SkinTypeRecommendations from '../components/ProductHighlights/SkinTypeRecommendations'

const Home = () => {
  return (
    <div>
      <Banner />
      <SkinTypeRecommendations />
      <ProductClassification />
      <ProductHighlights />
      <DealBanner />
      <News />
      <FAQSection />
      <Blog />
    </div>
  )
}

export default Home