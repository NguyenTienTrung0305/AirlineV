import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/router";
import '@/styles/index.css';

// Component: là trang hiện tại được render, Khi bạn truy cập một trang (/about, /contact...), Next.js tự động truyền trang tương ứng vào Component
// pageProps:  là các dữ liệu (props) mà Next.js truyền vào trang hiện tại
function MyApp({ Component, pageProps }) {
    const router = useRouter();

  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;


// mặc định của pages/_app.js => router sẽ là router /
// => pages/login.jsx => router sẽ alf router /login
// => pages/auth/login.jsx => router sẽ là /auth/login
// => pages/news/index.jsx => router là /news
// => pages/news/article.jsx => router là /news/article