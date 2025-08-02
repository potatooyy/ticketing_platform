// src/app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" className="h-100">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className="bg-dark text-light d-flex flex-column h-100">
        <CartProvider>
        <AuthProvider>
          <a href="#main-content" className="visually-hidden-focusable btn btn-primary position-absolute top-0 start-0" style={{ zIndex: 9999 }}>
            跳至主要內容
          </a>
          <Header />
          <main id="main-content" className="flex-grow-1" role="main">{children}</main>
          <Footer />
        </AuthProvider>
      </CartProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" async />
      </body>
    </html>
  )
}
