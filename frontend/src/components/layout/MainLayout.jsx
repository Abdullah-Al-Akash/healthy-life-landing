  import Navbar from "./Navbar";
  import Footer from "./Footer";
import WhatsAppFloating from "../WhatsAppFloating";


  const MainLayout = ({ children }) => {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <WhatsAppFloating></WhatsAppFloating>
        <Footer />
      </div>
    );
  };

  export default MainLayout;