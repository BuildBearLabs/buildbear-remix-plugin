import React from "react";
import BuildbearLogoBlack1 from "../images/BuildbearLogoBlack.webp";
import BuildbearLogoWhite1 from "../images/BuildbearLogoWhite.webp";
import { Tooltip, Button, OverlayTrigger } from "react-bootstrap";
const Header = ({ theme, resetButton }) => {
  return (
    <div className="d-flex justify-content-between align-items-center ">
      <div className="d-flex align-items-center " style={{ height: "60px" }}>
        {theme === "light" ? (
          <img
            src={BuildbearLogoBlack1}
            alt="Buildbear-Logo-Black"
            height="40"
            width="40"
            className="mr-2"
          />
        ) : (
          <img
            src={BuildbearLogoWhite1}
            alt="Buildbear-Logo-White"
            height="40"
            width="40"
            className="mr-2"
          />
        )}

        {/* <div>BuildBear Sandbox</div> */}
      </div>
      <div className="d-flex align-items-center  ">
        <div></div>

        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip style={{ borderBottom: "0px solid #fff" }}>
              To reset the configuration and establish a new sandbox.
            </Tooltip>
          }
        >
          <div className="d-flex justify-content-between align-items-center ">
            <i className=" ml-2 fas fa-info-circle mr-2  " />
          </div>
        </OverlayTrigger>

        <Button
          className="btn btn-secondary"
          onClick={() => {
            resetButton();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Header;
