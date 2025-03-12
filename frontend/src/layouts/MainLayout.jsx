import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

// children nội dung của trang (ví dụ index.js)
const MainLayout = ({ children }) => {
    return (
        <>
            <NavBar />
            {children} 
            <Footer />
        </>
    )
}

export default MainLayout;