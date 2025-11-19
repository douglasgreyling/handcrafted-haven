import Link from "next/link";
import { SearchInput } from "./SearchInput"
const Navigation = () => {
  return (
    <div>
        <nav className="flex pd-4 bg-gray-200">
        
        <div className="flex"><SearchInput /></div>
        <div><ul className="mt-10 flex pd-5" >
      <li><Link  className=""href="/userDashboard/login">LogIn</Link></li>
      <li><Link href="/userDashboard/signup">sign Up</Link></li>
      <li><Link href="/sellerDashboard/login">Seller LogIn</Link></li>
        
       
      
    </ul>
      </div>
        <div></div>
         
    
         
        

        </nav>
       
      
    </div>
  )
}

export default Navigation
