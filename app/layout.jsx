import { Roboto, Montserrat } from 'next/font/google';
import "./globals.css";
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Providers from '../components/Providers'

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });

export const metadata = {
  title: "Handcrafted Haven",
  description: "Discover unique, artisan-made items from talented creators",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.className} bg-background text-dark antialiased`}
    >
      <body
        className="min-h-screen font-sans flex flex-col"
      >
        <Providers>
          <Navigation />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}