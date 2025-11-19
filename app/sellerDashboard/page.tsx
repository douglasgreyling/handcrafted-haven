import Navigation from "../../components/seller/navigation";
import CreateProduct from"./CreateProduct/page";
import ItermList from"./ItermList/page";
const SellerDashboard=() => {
    return (
        <div className="p-8 grid gap-4" >
            <Navigation />
            <h1 className="text-2xl font-display text-dark">Seller Dashboard</h1>
            <p className="mt-2 text-dark">
                Manage your products and view sales statistics here.    
            </p>
            <CreateProduct />
            <ItermList />
        </div>
    )
}
export default SellerDashboard;