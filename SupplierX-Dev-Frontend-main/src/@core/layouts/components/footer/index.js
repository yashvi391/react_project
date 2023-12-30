// ** Icons Import
import { Heart } from "react-feather";

const Footer = () => {
  return (
    <p className="clearfix mb-0">
      <span className="float-md-start d-block d-md-inline-block mt-25">
        COPYRIGHT © {new Date().getFullYear()} Designed By {""}
        <a
          href="https://www.aeonx.digital/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.aeonx.digital
        </a>
        {/* <span className="d-none d-sm-inline-block">, All rights Reserved</span> */}
      </span>
      {/* <span className="float-md-end d-none d-md-block">
        Hand-crafted & Made by Aeonx Digital
      </span> */}
    </p>
  );
};

export default Footer;
