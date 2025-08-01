// src/components/layout/Footer.js
export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="row g-3 align-items-start">
          <div className="col-12 col-md-3 footer-logo mb-3 mb-md-0">
            <span className="fw-bold footer-logo-year">© 2025 TixGo</span>
            <span className="ms-2 text-secondary footer-logo-copy">版權所有</span>
          </div>
          <div className="col-12 col-md-3">
            <div className="footer-title">客服信箱</div>
            <div className="footer-text">TixGo@gmail.com</div>
            <div className="footer-text">
              週一至五 9:00~12:00, 13:00~18:00<br /><span className="text-secondary">(假日休息)</span>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="footer-title">服務專線</div>
            <div className="footer-text">02-00000000</div>
          </div>
          <div className="col-12 col-md-3">
            <div className="footer-title">系統專線</div>
            <div className="footer-text">02-00000000</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

