export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <div className="footer-grid">

          {/* Brand */}
          <div>
            <span className="footer-wordmark">
              MEDIA<span>VISUAL</span>
            </span>
            <p className="footer-tagline">
              Progettazione e installazione di totem, stand e display
              pubblicitari per centri commerciali e spazi retail.
            </p>
          </div>

          {/* Azienda */}
          <div>
            <h3 className="footer-col-title">Azienda</h3>
            <ul className="footer-links">
              <li><a href="/servizi">Servizi</a></li>
              <li><a href="/realizzazioni">Realizzazioni</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contatti">Contatti</a></li>
            </ul>
          </div>

          {/* Contatti / Dati società */}
          <div>
            <h3 className="footer-col-title">Contatti</h3>
            <address className="footer-address">
              <span className="footer-company">Sport In Srl</span>
              <span>Via A. Albricci, 9</span>
              <span>20122 Milano</span>
              <span className="footer-vat">P.IVA 06414070968</span>
              <a href="mailto:comunicazione@mediavisual.it">
                comunicazione@mediavisual.it
              </a>
            </address>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bar">
          <p className="footer-copy">
            © {new Date().getFullYear()} Mediavisual.{' '}
            Sito realizzato da{' '}
            <a href="https://leadforge.it/" target="_blank" rel="noopener noreferrer">
              LeadForge.it
            </a>
          </p>
          <div className="footer-legal-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="footer-sep">·</span>
            <a href="/cookie">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
