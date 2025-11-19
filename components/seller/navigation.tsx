import Link from "next/link";


const Navigation = () => {
  return (
    <div>
        <nav className="flex pd-4 bg-gray-200">
        
       
        <div><ul className="mt-10 flex pd-5" >
      <li><Link  className=""href="../sellerDashboard/CreateProduct">Create Products Here</Link></li>
      <li><Link href="../sellerDashboard/ItermList">Products List Here</Link></li>
     
        
       
      
    </ul>
      </div>
        <div></div>
         
    
         
        

        </nav>
       
      
    </div>
  )
}

export default Navigation
