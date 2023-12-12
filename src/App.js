import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@remixproject/plugin-webview";

import axios from "axios";
import useSWR from "swr";
import { BuildbearLogoBlack, BuildbearLogoWhite } from "./svg";
import Cookies from "universal-cookie";
// import { BuildbearClient } from "./BuildbearClient";
import { PluginClient } from "@remixproject/plugin";
import { Button } from "react-bootstrap";

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
    setSelectedChain(chains[0].id);
    if (selectedChain) {
      const selectedChainObject = chains.find(
        (chain) => chain.id === selectedChain
      );
      if (selectedChainObject) {
        setSelectedOption(selectedChainObject.options[0]?.value);
      }
    }
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

  //Checking Sandbox status in every 1 sec
  const containerApi = useSWR(
    nodeId && !live ? "/user/container" : null,
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

  //check metamask
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
    if (showRpc) {
      setTimeout(() => {
        setShowRpc(false);
      }, 7000);
    }
  }, [showRpc]);

  useEffect(() => {
    document.addEventListener("visibilitychange", checkMetamaskLock);
    return () =>
      document.removeEventListener("visibilitychange", checkMetamaskLock);
  }, []);

  return (
    <div className=" ">
      <header className="App-header">
        <div className="">
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
                className="btn btn-secondary"
                onClick={() => {
                  resetButton();
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="text-uppercase">
            <div
              style={{
                marginBottom: "4px",
                marginTop: "16px",
              }}
            >
              <label>Select a blockchain to fork from :</label>
              <select
                className="form-control custom-select "
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
                  marginBottom: "4px",
                }}
              >
                <label style={{}}>Choose between testnet/mainnet :</label>
                <select
                  style={{}}
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="form-control custom-select "
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
                // display: "flex",
                // justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              {selectedOption && !nodeId && (
                <button
                  onClick={() => {
                    createNode();
                    setLoader(true);
                  }}
                  className="btn btn-primary mb-4   "
                  style={{
                    width: "128px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {loader ? <div className="loader"></div> : "Create Testnet"}
                </button>
              )}
            </div>

            <div style={{ fontSize: "20px" }}>
              {nodeId && <div className="  mt-0 border-bottom mb-4"></div>}
              {nodeId && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "left",
                      // justifyContent: "left",
                      // alignItems: "center",
                      gap: "10px",
                      marginBottom: "16px",
                      fontSize: "11px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {" "}
                      <span className=" text-uppercase">Sandbox ID :</span>{" "}
                      <span>{testnetName(nodeId)} </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // backgroundColor: "green",
                        // alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                        fontSize: "11px",
                        paddingTop: "2px",
                      }}
                      // className="text-uppercase"
                    >
                      <div className="text-uppercase"> Sandbox Status : </div>
                      <div
                        style={{
                          // backgroundColor: "red",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "col",
                          alignItems: "center",
                          float: "left",
                          gap: "10px",
                          // marginBottom: "6px",
                          fontSize: "13px",
                          border: `1px solid ${live ? "green" : "red"}`,
                          padding: "3px 4px",
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
                            fontSize: "11px",
                            paddingRight: "2px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          className="text-uppercase"
                        >
                          {live ? (
                            <span className="pr-1">Live</span>
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
                      {/* {live ? (
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
                      )} */}
                    </div>
                  </div>
                  <div></div>
                </div>
              )}
            </div>

            {live && (
              <div
                style={{
                  display: "grid",
                  // gridTemplateColumns: 'repeat(2, 1fr)',
                  // flexDirection: "row",
                  alignItems: "start",
                  gap: "10px",
                  fontSize: "16px",
                }}
              >
                {nodeId ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowRpc(!showRpc);
                          copy(
                            `https://rpc.${process.env.REACT_APP_BASE_URL}/${nodeId}`
                          );
                        }}
                        className="btn btn-info"
                      >
                        View & Copy RPC
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          connectMetaMask(nodeId, checkMetamaskLock);
                        }}
                      >
                        Add to Metamask
                      </button>
                    </div>

                    {showRpc && (
                      <div
                        style={{
                          // backgroundColor: "#35384c",
                          width: "100%",
                          alignItems: "center",
                          display: "flex",
                          padding: "8px 0px",
                          justifyContent: "space-between",
                          // marginTop: "10px",
                          // marginBottom: "14px",
                        }}
                        // className=" mt-4"
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          className="form-control "
                          typeof="text"
                        >
                          https://rpc.{process.env.REACT_APP_BASE_URL}/{nodeId}
                        </div>{" "}
                        <Button
                          variant="link"
                          size="md"
                          className="m-2 p-2 float-right"
                          onClick={() => {
                            copy(
                              `https://rpc.${process.env.REACT_APP_BASE_URL}/${nodeId}`
                            );
                          }}
                        >
                          <i className="far fa-copy" />
                        </Button>
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                      }}
                    >
                      <a
                        href={`https://explorer.${process.env.REACT_APP_BASE_URL}/${nodeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-info text-decoration-none"
                      >
                        Open Explorer
                      </a>
                      <a
                        href={`https://faucet.${process.env.REACT_APP_BASE_URL}/${nodeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-info text-decoration-none"
                      >
                        Open Faucet
                      </a>
                    </div>
                  </>
                ) : (
                  ""
                )}
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
