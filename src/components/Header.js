import React from "react";
import BuildbearLogoBlack1 from "../images/BuildbearLogoBlack.webp";
import BuildbearLogoWhite1 from "../images/BuildbearLogoWhite.webp";
const Header = ({theme, resetButton}) => {
  return (
    <div
      className=" "
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: "60px",
        }}
      >
        {theme === "light" ? (
          <img
            src={BuildbearLogoBlack1}
            alt="Buildbear-Logo-Black"
            height="40"
            width="40"
          />
        ) : (
          <img
            src={BuildbearLogoWhite1}
            alt="Buildbear-Logo-White"
            height="40"
            width="40"
          />
        )}

        <div>BuildBear Sandbox</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            border: "1px solid white ",
            width: "20px",
            height: "20px",
            borderRadius: "100%",
            fontSize: "14px",
            fontWeight: "400",
          }}
          className="tooltip"
        >
          i
          <span className="tooltiptext">
            To reset the configuration and establish a new sandbox.
          </span>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => {
            resetButton();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Header;
