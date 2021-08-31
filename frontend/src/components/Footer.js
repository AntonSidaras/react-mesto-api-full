import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">&#169; {new Date().getFullYear()} Anton Sidaras</p>
    </footer>
  );
}

export default Footer;