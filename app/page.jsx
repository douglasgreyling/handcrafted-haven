import ProductCard from "../components/ProductCard"
import Link from 'next/link'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-r from-indigo-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Welcome to <span className="text-indigo-600">Handcrafted Haven</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover unique, handmade items crafted with love and care by talented artisans.
                Support creativity and find one-of-a-kind pieces for your home and life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Handcrafted Haven?</h2>
              <p className="text-gray-600">Experience the difference of authentic, handmade craftsmanship</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Made with Love</h3>
                <p className="text-gray-600">Every item is carefully crafted by passionate artisans who pour their heart into their work.</p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Unique & Original</h3>
                <p className="text-gray-600">Find one-of-a-kind pieces you won&apos;t see anywhere else, each with its own story and character.</p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainable Choice</h3>
                <p className="text-gray-600">Support sustainable practices and local communities while getting beautiful, lasting products.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
              <p className="text-gray-600">Check out some of our most popular handcrafted items</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProductCard
                id={1}
                title="Handcrafted Ceramic Mug"
                priceCents={2500}
                imageUrl="https://picsum.photos/500"
                category="Pottery"
                description="Beautiful handmade ceramic mug with unique glaze patterns."
              />
              <ProductCard
                id={2}
                title="Wooden Cutting Board"
                priceCents={4500}
                imageUrl="https://picsum.photos/200"
                category="Kitchenware"
                description="Premium hardwood cutting board made from sustainable oak."
              />
              <ProductCard
                id={3}
                title="Knitted Wool Scarf"
                priceCents={3200}
                imageUrl="https://picsum.photos/200"
                category="Textiles"
                description="Cozy hand-knitted scarf made from 100% merino wool."
              />
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home