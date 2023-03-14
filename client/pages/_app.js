import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav/Nav";
import { Provider } from "react-redux";
import store from "../store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const [path, setPath] = useState(null);

    useEffect(() => {
        switch (router.pathname) {
            case "/signin":
                setPath("ลงชื่อเข้าใช้");
                break;
            case "/attention":
                setPath("จัดการ Attention List");
                break;
            case "/notifications":
                setPath("การแจ้งเตือน");
                break;
            case "/blogs/create":
                setPath("สร้างบล็อค");
                break;
            case "/questions/create":
                setPath("ถามคำถาม");
                break;
            default:
                setPath("อุ่นใจ");
        }
    }, [router.pathname]);

    return (
        <>
            <Head>
                <style>
                    @import url(https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap);
                </style>
                <title>{path}</title>
            </Head>
            <Provider store={store}>
                <Nav />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Component {...pageProps} />
            </Provider>
        </>
    );
}
