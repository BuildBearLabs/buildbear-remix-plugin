import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "",
        fontSize: "12px",
        textAlign: "left",
        marginTop: "10px",
      }}
    >
      <div>How to use BuildBear's Sandbox</div>
      <ol style={{ paddingLeft: "12px" }}>
        <li className="doc-list">
          Once your Sandbox is live, add the network to Metamask by clicking
          ‘Add to Metamask’ button.
        </li>
        <li className="doc-list">
          Visit the 4th plugin "Deploy and Run Transactions"
        </li>
        <li className="doc-list">
          Drop down on the ‘Environment’ and select “Injected Provider -
          Metamask”
        </li>
        <li className="doc-list">
          Your Remix IDE will be connected to the BuildBear Sandbox you just
          created.
        </li>
      </ol>
      <div>
        If you have any issues, you can reach out to us on team@buildbear.io or{" "}
        <a
          href="https://t.me/Web3_dApp_Developers"
          target="_noref"
        >
          https://t.me/Web3_dApp_Developers
        </a>
      </div>
      <br />
      <div>Additional Notes:</div>
      <ol style={{ paddingLeft: "12px" }}>
        <li>
          If you want to reset your sandbox, you can use the "Reset" button on
          the top-right corner of this plugin.
        </li>
        <li>
          If you want to claim this sandbox and access it through BuildBear
          dashboard, click the ‘Claim Sandbox’ button.
        </li>
      </ol>
    </div>
  );
};

export default Footer;
