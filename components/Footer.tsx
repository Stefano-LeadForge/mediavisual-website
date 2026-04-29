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

          {/* Link rapidi */}
          <div>
            <h3 className="footer-col-title">Soluzioni</h3>
            <ul className="footer-links">
              <li><a href="/prodotti">Totem Digitali</a></li>
              <li><a href="/prodotti">Stand Espositivi</a></li>
              <li><a href="/prodotti">LED Wall</a></li>
              <li><a href="/progetti">Progetti</a></li>
            </ul>
          </div>

          {/* Azienda */}
          <div>
            <h3 className="footer-col-title">Azienda</h3>
            <ul className="footer-links">
              <li><a href="/chi-siamo">Chi Siamo</a></li>
              <li><a href="/contatti">Contatti</a></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="footer-col-title">Contatti</h3>
            <ul className="footer-contacts">
              {/* AGGIORNARE con i dati reali del cliente */}
              <li><a href="mailto:info@mediavisual.it">info@mediavisual.it</a></li>
              <li><a href="tel:+390000000000">+39 000 000 0000</a></li>
            </ul>
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
