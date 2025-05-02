import React from "react";
import { Tooltip, Button, OverlayTrigger } from "react-bootstrap";

const Header = ({ resetButton }) => {
  return (
    <div className="d-flex justify-content-between align-items-center ">
      <div className="d-flex align-items-center " style={{ height: "60px" }}>
        <img
          src="https://r2.buildbear.io/brand-v2/logo/svg/Logo-Mark-Green.svg"
          alt="Buildbear-Logo-Black"
          height="36"
          width="36"
          className="mr-2"
        />
        <div>BuildBear Sandbox</div>
      </div>
      <div className="d-flex align-items-center  ">
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
