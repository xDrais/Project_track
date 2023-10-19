import { Link } from "react-router-dom";
function Footer () {
    return (  

        <> 
                <footer className="footer bg-light">
                  <div
                    className="container-fluid d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-1 container-p-x py-3"
                  >
                    <div>
                      <Link
                        to="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/landing/"
                        
                        className="footer-text fw-bolder">Sneat</Link>
                      ©
                    </div>
                    <div>
                      <Link to="https://themeselection.com/license/" className="footer-link me-4" >License</Link>
                      <Link to="" className="footer-link me-4">Help</Link>
                      <Link to="" className="footer-link me-4">Contact</Link>
                      <Link to="" className="footer-link">Terms &amp; Conditions</Link>
                    </div>
                  </div>
                </footer>
      </>
    );
}
 
export default Footer;