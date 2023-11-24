import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@remixproject/plugin-webview";

import axios from "axios";
import useSWR from "swr";
import { BuildbearLogoBlack, BuildbearLogoWhite } from "./svg";
import Cookies from "universal-cookie";
// import { BuildbearClient } from "./BuildbearClient";
import { PluginClient } from "@remixproject/plugin";
const { ethers } = require("ethers");
const copy = require("copy-to-clipboard");

export const client = new PluginClient();
createClient(client);

function App() {
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedOption, setSelectedOption] = useState();
  const [chains, setChains] = useState([]);
  const [chainId, setChainId] = useState();
  const [nodeId, setNodeId] = useState();
  const [loader, setLoader] = useState(false);
  const [live, setLive] = useState(false);
  const [blockNumber, setBlockNumber] = useState();
  const [showRpc, setShowRpc] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [metamaskLock, setMetamaskLock] = useState(true);

  useEffect(() => {
    let cookies = new Cookies();
    console.log("cookies", cookies);
    let installed = cookies.get("plugin-installed");
    console.log("installed", installed);
    if (!installed) {
      cookies.set("plugin-installed", "true");
      // track("Remix: Plugin Installed", {}, userData);
    }
    client.on("theme", "themeChanged", (theme) => {
      // console.log(JSON.stringify(theme))
      setTheme(theme?.quality ?? "dark");
    });
  });
  useEffect(() => {
    // console.log("Theming", theme)
  }, [theme]);

//Sand box Reset Button
  function resetButton() {
    setSelectedChain("");
    setSelectedOption();
    setNodeId();
    setBlockNumber();
    setLoader(false);
    setLive(false);
    setShowRpc(false);
    
  }

  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
    setSelectedOption("");
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    //Get chain details from the backend
    async function getChains() {
      const config = {
        method: "get",
        url: `https://backend.${process.env.REACT_APP_BASE_URL}/chains`,
        headers: {
          Authorization: `Bearer BB_a55d709e-4f81-973a-9513-6681d36e0970`,
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios(config);
        console.log(res?.data);
        setChains(res?.data);
        setSelectedChain(res?.data[0].id);
      } catch (_) {}
    }
    getChains();
  }, []);

  //Post container request
  async function createNode() {
    const data = JSON.stringify({
      chainId: selectedOption,
    });

    const config = {
      method: "post",
      url: `https://api.${process.env.REACT_APP_BASE_URL}/v1/buildbear-sandbox`,

      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_SANDBOX_TOKEN}`,
        "Content-Type": "application/json",
      },
      data,
    };
    try {
      const res = await axios(config);
      console.log("post", res);
      setNodeId(res?.data?.sandboxId);
      setBlockNumber(res?.data?.forkingDetails?.blockNumber);
    } catch (_) {}
    setLoader(false);
  }

  //Get Node details
  async function getNodeDetails() {
    const config = {
      method: "get",
      url: `https://backend.${process.env.REACT_APP_BASE_URL}/user/container/${nodeId}`,
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_SANDBOX_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios(config);
      console.log(res?.data);
      if (res.status === 200) {
        setLive(true);
      }
    } catch (_) {}
  }

  //Checking Node status in every 1 sec
  const containerApi = useSWR(
    (nodeId && !live) ? "/user/container" : null,
    getNodeDetails,
    {
      refreshInterval: 1000,
    }
  );

  //Helper function for Sandbox Name
  function testnetName(temp) {
    if (temp?.includes("-")) {
      const words = temp.replaceAll("-", " ").slice(0, -9).split(" ");
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return capitalizedWords.join("-");
    } else {
      return temp || "";
    }
  }

  useEffect(() => {
    if (selectedChain) {
      const selectedChainObject = chains.find(
        (chain) => chain.id === selectedChain
      );
      if (selectedChainObject) {
        setSelectedOption(selectedChainObject.options[0]?.value);
      }
    }
  }, [selectedChain, chains]);

  async function connectMetaMask(nodeHash, checkMetamaskLock) {
    if (!window.ethereum) {
      console.log("Metamask not found. Please Install it.");
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider({
      url: `https://rpc.${process.env.REACT_APP_BASE_URL}/${nodeHash}`,
      timeout: 5000,
    });

    const { chainId } = await provider.getNetwork();

    const formattedName = testnetName(nodeHash);

    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: `BuildBear ${formattedName}`,
            chainId: `0x${chainId.toString(16)}`,
            rpcUrls: [
              `https://rpc.${process.env.REACT_APP_BASE_URL}/${nodeHash}`,
            ],
            blockExplorerUrls: [
              `https://explorer.${process.env.REACT_APP_BASE_URL}/${nodeHash}`,
            ],
            nativeCurrency: {
              name: "BB Ether",
              symbol: "BB ETH",
              decimals: 18,
            },
          },
        ],
      })
      .then((data) => {
        if (data === null) {
          console.log("Successfully added.");
          checkMetamaskLock();
        } else {
          console.log("Unable to add.");
        }
      })
      .catch((e) => {
        if (e.code === 4902) {
          console.log("network is not available, add it");
        } else if (e.code === 4001) {
          console.log("User rejected the request");
        } else {
          // errortoast("could not set network")
          console.log("Unable to add network");
        }
        //
      });
  }


  async function checkMetamaskLock() {
    const { ethereum } = window;
    const accounts = await ethereum?._metamask?.isUnlocked();
    if (accounts) {
      setMetamaskLock(true);
    } else {
      setMetamaskLock(false);
    }
    //
  }
  useEffect(() => {
    checkMetamaskLock();
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", checkMetamaskLock);
    return () =>
      document.removeEventListener("visibilitychange", checkMetamaskLock);
  }, []);

  return (
    <div className="App">
      <header className="App-header">

        <div>
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
              {theme === "light" ? BuildbearLogoBlack() : BuildbearLogoWhite()}

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
                className="ide-button"
                style={
                  {
                    //   backgroundColor: `${theme === "dark" ? 'red' :  '#92a0ab'}`,
                    //  color: `${theme === "dark" ? 'white' :  'black'}`,
                  }
                }
                onClick={() => {
                  resetButton();
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                flexDirection: "column",
                marginBottom: "10px",
                gap: "10px",
                fontSize: "16px",
                marginTop: "16px",
              }}
            >
              <label style={{ display: "flex", fontSize: "16px" }}>
                Select a blockchain to fork from :{" "}
              </label>
              <select
                style={{
                  height: "34px",
                  borderRadius: "5px",
                  // backgroundColor:  `#35384c`,
                  backgroundColor: `${theme === "dark" ? "#35384c" : ""}`,

                  color: `${theme === "dark" ? "white" : "black"}`,
                  paddingLeft: "10px",
                }}
                value={selectedChain}
                onChange={handleChainChange}
              >
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedChain && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "16px",
                  marginTop: "16px",
                }}
              >
                <label style={{ display: "flex", fontSize: "16px" }}>
                  Choose between testnet/mainnet :{" "}
                </label>
                <select
                  style={{
                    height: "34px",
                    borderRadius: "5px",
                    backgroundColor: `${theme === "dark" ? "#35384c" : ""}`,
                    color: `${theme === "dark" ? "white" : "black"}`,
                    paddingLeft: "10px",
                  }}
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  {chains
                    .find((chain) => chain.id === selectedChain)
                    ?.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <>{selectedOption ? <></> : ""}</>
          </div>

          <div style={{}}>
            <div
              style={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {selectedOption && !nodeId && (
                <button
                  onClick={() => {
                    createNode();
                    setLoader(true);
                  }}
                  className="ide-button"
                >
                  Create Testnet
                </button>
              )}
              {loader && <div className="loader"></div>}
            </div>

            <div style={{ fontSize: "20px" }}>
              {nodeId && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "left",
                      // justifyContent: "left",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "16px",
                      fontSize: "16px",
                    }}
                  >
                    <div>Sandbox ID : {testnetName(nodeId)} </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent: "left",
                        // backgroundColor: "green",
                        // alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                        fontSize: "14px",
                        paddingTop: "2px",
                      }}
                    >
                      <div style={{ marginTop: "5px" }}> Sandbox Status : </div>
                      <div
                        style={{
                          // backgroundColor: "red",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "col",
                          alignItems: "center",
                          float: "left",
                          gap: "10px",
                          marginBottom: "6px",
                          fontSize: "16px",
                          border: `1px solid ${live ? "green" : "red"}`,
                          padding: "3px 5px",
                          borderRadius: "20px",
                        }}
                      >
                        {live ? (
                          <span className="live-node "></span>
                        ) : (
                          <span className=" notlive-node"></span>
                        )}{" "}
                        <div
                          style={{
                            fontSize: "14px",
                            paddingRight: "2px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {live ? (
                            "Live"
                          ) : (
                            <>
                              Starting{" "}
                              <div
                                style={{ marginLeft: "5px" }}
                                className="loader"
                              ></div>
                            </>
                          )}
                        </div>
                      </div>
                      {live ? (
                        ""
                      ) : (
                        <div
                          style={{
                            border: "1px solid white ",
                            width: "20px",
                            height: "20px",
                            borderRadius: "100%",

                            marginTop: "6px",
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                          className="tooltip"
                        >
                          i
                          <span className="tooltiptext">
                            Kindly wait as the sandbox is being created.{" "}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div></div>
                </div>
              )}
            </div>

            {live && (
              <div
                style={{
                  display: "flex",
                  // flexDirection: "row",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                {nodeId ? (
                  <>
                    <button
                      onClick={() => {
                        setShowRpc(!showRpc);
                      }}
                      className="ide-button"
                    >
                      View & Copy RPC
                    </button>

                    <a
                      href={`https://explorer.${process.env.REACT_APP_BASE_URL}/${nodeId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="ide-button">View Explorer</button>
                    </a>
                    <a
                      href={`https://faucet.${process.env.REACT_APP_BASE_URL}/${nodeId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="ide-button">Open Faucet</button>
                    </a>
                    <button
                      className="ide-button"
                      onClick={() => {
                        connectMetaMask(nodeId, checkMetamaskLock);
                      }}
                    >
                      Add to Metamask
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
            )}

            {showRpc && (
              <div
                style={{
                  // backgroundColor: "#35384c",
                  width: "100%",
                  alignItems: "center",
                  display: "flex",
                  padding: "8px 0px",
                  justifyContent: "space-between",
                  marginTop: "10px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    marginLeft: "14px",
                    fontSize: "14px",
                    paddingRight: "10px",
                  }}
                >
                  https://rpc.{process.env.REACT_APP_BASE_URL}/{nodeId}{" "}
                </div>{" "}
                <button
                  className=""
                  style={{
                    backgroundColor: "#6a7098",
                    marginRight: "10px",
                    // backgroundColor: "#595c76",
                    borderRadius: "5px",
                    color: "white",
                    padding: "6px 10px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  clipboard-write
                  // onClick={() => {
                  //   navigator.clipboard.writeText(
                  //     `rpc.dev.buildbear.io/${nodeId}`
                  //   );
                  // }}
                  onClick={() => {
                    copy(
                      `https://rpc.${process.env.REACT_APP_BASE_URL}/${nodeId}`
                    );
                  }}
                >
                  {}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    shape-rendering="geometricPrecision"
                    text-rendering="geometricPrecision"
                    image-rendering="optimizeQuality"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    viewBox="0 0 438 511.52"
                    height={18}
                  >
                    <path
                      fill-rule="nonzero"
                      d="M141.44 0h172.68c4.71 0 8.91 2.27 11.54 5.77L434.11 123.1a14.37 14.37 0 0 1 3.81 9.75l.08 251.18c0 17.62-7.25 33.69-18.9 45.36l-.07.07c-11.67 11.64-27.73 18.87-45.33 18.87h-20.06c-.3 17.24-7.48 32.9-18.88 44.29-11.66 11.66-27.75 18.9-45.42 18.9H64.3c-17.67 0-33.76-7.24-45.41-18.9C7.24 480.98 0 464.9 0 447.22V135.87c0-17.68 7.23-33.78 18.88-45.42C30.52 78.8 46.62 71.57 64.3 71.57h12.84V64.3c0-17.68 7.23-33.78 18.88-45.42C107.66 7.23 123.76 0 141.44 0zm30.53 250.96c-7.97 0-14.43-6.47-14.43-14.44 0-7.96 6.46-14.43 14.43-14.43h171.2c7.97 0 14.44 6.47 14.44 14.43 0 7.97-6.47 14.44-14.44 14.44h-171.2zm0 76.86c-7.97 0-14.43-6.46-14.43-14.43 0-7.96 6.46-14.43 14.43-14.43h136.42c7.97 0 14.43 6.47 14.43 14.43 0 7.97-6.46 14.43-14.43 14.43H171.97zM322.31 44.44v49.03c.96 12.3 5.21 21.9 12.65 28.26 7.8 6.66 19.58 10.41 35.23 10.69l33.39-.04-81.27-87.94zm86.83 116.78-39.17-.06c-22.79-.35-40.77-6.5-53.72-17.57-13.48-11.54-21.1-27.86-22.66-48.03l-.14-2v-64.7H141.44c-9.73 0-18.61 4-25.03 10.41C110 45.69 106 54.57 106 64.3v319.73c0 9.74 4.01 18.61 10.42 25.02 6.42 6.42 15.29 10.42 25.02 10.42H373.7c9.75 0 18.62-3.98 25.01-10.38 6.45-6.44 10.43-15.3 10.43-25.06V161.22zm-84.38 287.11H141.44c-17.68 0-33.77-7.24-45.41-18.88-11.65-11.65-18.89-27.73-18.89-45.42v-283.6H64.3c-9.74 0-18.61 4-25.03 10.41-6.41 6.42-10.41 15.29-10.41 25.03v311.35c0 9.73 4.01 18.59 10.42 25.01 6.43 6.43 15.3 10.43 25.02 10.43h225.04c9.72 0 18.59-4 25.02-10.43 6.17-6.17 10.12-14.61 10.4-23.9z"
                    />
                  </svg>
                </button>{" "}
              </div>
            )}
          </div>
        </div>
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
      </header>
    </div>
  );
}

export default App;
