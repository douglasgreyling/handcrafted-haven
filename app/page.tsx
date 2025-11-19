import Announcement  from "../components/user/announcement"
import Footer from "../components/user/Footer"
import Navigation from "../components/user/navigation"
import ProductCard from "../components/user/ProductCard";


const Home = () => {
  return (
    <div >
      <Announcement />
      <Navigation />
      <main className="p-4">
        <h1 className="text-2xl font-display text-dark">Welcome to Handcrafted Haven</h1>
        <p className="mt-2 text-dark">
          Discover unique handmade items crafted with love and care.
        </p>
        <ProductCard id={1} title="Handmade Vase" priceCents={2500} imageUrl="/images/vase.jpg" category="Home Decor" />
      </main>
      <Footer />
      
    </div>
  )
}

export default Home
