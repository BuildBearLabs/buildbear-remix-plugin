import React from 'react'

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
        Once your Sandbox is live, copy the RPC
      </li>
      <li className="doc-list">
        Visit the 4th plugin "Deploy and Run Transactions"
      </li>
      <li className="doc-list">Drop down on the Environment</li>
      <li className="doc-list">Select "Custom External Http Provider"</li>
      <li className="doc-list">
        In the input box "External HTTP Provider Endpoint, paste the RPC
        (copied in Step 1)
      </li>
      <li className="doc-list">
        Your Remix IDE will be connected to the BuildBear Sandbox you just
        created.
      </li>
    </ol>
    <div>
      If you have any issues, you can reach out to us on team@buildbear.io
      or{" "}
      <a
        href="https://t.me/Web3_dApp_Developers"
        target="  _noref "
        // className="link-doc"
      >
        https://t.me/Web3_dApp_Developers
      </a>
    </div>
    <br />
    <div>Additional Notes:</div>
    <ol style={{ paddingLeft: "12px" }}>
      <li>
        If you want to reset your sandbox, you can use the "Reset" button
        on the top-right corner of this plugin
      </li>
    </ol>
  </div>
  )
}

export default Footer