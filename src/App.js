import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import useSWR from "swr";
import { BuildbearLogo } from "./svg";

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
  // const chains = [
  //   {
  //     name: "Ethereum",
  //     id: "Ethereum",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Ethereum Mainnet",
  //         value: "1",
  //         networkRpc: "https://rpc.ankr.com/eth",
  //       },
  //       {
  //         label: "Goerli Testnet",
  //         value: "5",
  //         networkRpc: "https://rpc.ankr.com/eth_goerli",
  //       },
  //       {
  //         label: "Sepolia Testnet",
  //         value: "11155111",
  //         networkRpc: "https://rpc.sepolia.org/",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Polygon",
  //     id: "Polygon",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Polygon Mainnet",
  //         value: "137",
  //         networkRpc: "https://rpc.ankr.com/polygon",
  //       },
  //       {
  //         label: "Polygon Testnet",
  //         value: "80001",
  //         networkRpc: "https://rpc.ankr.com/polygon_mumbai",
  //       },
  //     ],
  //   },

  //   {
  //     name: "Arbitrum",
  //     id: "Arbitrum",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Arbitrum Mainnet",
  //         value: "42161",
  //         networkRpc: "https://arb1.arbitrum.io/rpc",
  //       },
  //       {
  //         label: "Arbitrum Goerli",
  //         value: "421613",
  //         networkRpc:
  //           "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Optimism",
  //     enabled: true,
  //     id: "Optimism",
  //     options: [
  //       {
  //         label: "Optimism Mainnet",
  //         value: "10",
  //         networkRpc: "https://mainnet.optimism.io",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Fantom",
  //     id: "Fantom",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Fantom Mainnet",
  //         value: "250",
  //         networkRpc: "https://rpc.fantom.network",
  //       },
  //       {
  //         label: "Fantom Testnet",
  //         value: "4002",
  //         networkRpc: "https://rpc.ankr.com/fantom_testnet",
  //       },
  //     ],
  //   },

  //   {
  //     name: "Avalanche",
  //     enabled: true,
  //     id: "Avalanche",
  //     options: [
  //       {
  //         label: "Avalanche Mainnet",
  //         value: "43114",
  //         networkRpc: "https://rpc.ankr.com/avalanche",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Binance",
  //     enabled: true,
  //     id: "Binance",
  //     options: [
  //       {
  //         label: "Binance Smart Chain",
  //         value: "56",
  //         networkRpc: "https://rpc.ankr.com/bsc",
  //       },
  //       {
  //         label: "BSC Testnet",
  //         value: "97",
  //         networkRpc:
  //           "https://little-palpable-seed.bsc-testnet.discover.quiknode.pro/9a49cf2c027187fa38ffe27450ca3e49daa49420",
  //       },
  //     ],
  //   },

  //   {
  //     name: "zkEVM polygon",
  //     id: "zkPolygon",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Polygon zkEVM",
  //         value: "1101",
  //         networkRpc: "https://zkevm-rpc.com",
  //       },
  //     ],
  //   },

  //   {
  //     name: "Linea",
  //     id: "linea",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Linea Mainnet",
  //         value: "59144",
  //         networkRpc: "https://rpc.linea.build",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Gnosis",

  //     id: "gnosis",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Gnosis",
  //         value: "100",
  //         networkRpc: "https://rpc.ankr.com/gnosis",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Omni",
  //     id: "omni",
  //     enabled: true,
  //     options: [
  //       {
  //         label: "Omni Testnet",
  //         value: "165",
  //         networkRpc: "https://testnet.omni.network",
  //       },
  //     ],
  //   },

  //   {
  //     name: "None",
  //     enabled: true,
  //     id: "None",
  //   },
  // ];

  function resetButton() {
    setSelectedChain("");
    setSelectedOption();
    setNodeId();
    setBlockNumber();
    setLoader(false);
    setLive(false);
  }

  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
    console.log("-----" + event.target.value);
    setSelectedOption("");
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const temp = localStorage.getItem("config-v0.8:.remix.config");
    console.log("-----", temp);
  }, []);

  useEffect(() => {
    async function getChains() {
      const config = {
        method: "get",
        url: `https://backend.dev.buildbear.io/chains`,
        headers: {
          Authorization: `Bearer BB_a55d709e-4f81-973a-9513-6681d36e0970`,
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios(config);
        console.log(res?.data);
        setChains(res?.data);
      } catch (_) {}
    }
    getChains();
  }, []);

  async function createNode() {
    const data = JSON.stringify({
      chainId: selectedOption,
    });

    const config = {
      method: "post",
      // url: `https://backend.dev.buildbear.io/api/createfork`,
      url: `https://api.dev.buildbear.io/v1/buildbear-sandbox`,

      headers: {
        Authorization: `Bearer BB_a55d709e-4f81-973a-9513-6681d36e0970`,
        "Content-Type": "application/json",
      },
      data,
    };
    try {
      const res = await axios(config);
      console.log("post", res);
      // console.log("post", res?.data);
      setNodeId(res?.data?.sandboxId);
      setBlockNumber(res?.data?.forkingDetails?.blockNumber);
    } catch (_) {}
    setLoader(false);
  }

  async function getNodeDetails() {
    const config = {
      method: "get",
      url: `https://backend.dev.buildbear.io/user/container/${nodeId}`,
      headers: {
        Authorization: `Bearer BB_a55d709e-4f81-973a-9513-6681d36e0970`,
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

  const containerApi = useSWR(
    nodeId ? "/user/container" : null,
    getNodeDetails,
    {
      refreshInterval: 1000,
    }
  );

  
  function testnetName(temp) {
    if (temp?.includes("-")) {
      const words = temp.replaceAll("-", " ").slice(0, -9).split(" ");
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return capitalizedWords.join(" ");
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

  return (
    <div className="App">
      <header className="App-header">
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
            {BuildbearLogo()}
            <div>BuildBear</div>
          </div>
          <div style={{ display: 'flex', alignItems: "center", gap: "10px"}} >
            <div style={{ border : "1px solid white ", width: "20px", height: "20px", borderRadius: "100%", fontSize: "14px", fontWeight: "600" }} >i</div>
            <button
              className="ide-button"
              onClick={() => {
                resetButton();
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* <div class="tooltip">
         ?
          <span class="tooltiptext">Please wait white testnet is creating</span>
        </div>
        <div>
          Hello
        </div> */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              marginBottom: "10px",
              gap: "10px",
              fontSize: "22px",
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
                backgroundColor: "#35384c",
                color: "white",
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
                fontSize: "22px",
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
                  backgroundColor: "#35384c",
                  color: "white",
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

          <>
            {selectedOption ? (
              <>
                {/* <div style={{ fontSize: "22px" }}>
                  <p>Selected Chain Id: {selectedOption}</p>
                </div> */}
              </>
            ) : (
              ""
            )}
          </>
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
            {loader && <div class="loader"></div>}
          </div>

          <br />

          <div style={{ fontSize: "20px" }}>
            {nodeId && (
              <div
                style={{
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                  fontSize: "18px" 
                }}
              >
                Sandbox Id: {testnetName(nodeId)}{" "}
                {live ? (
                  <span className="live-node "></span>
                ) : (
                  <span className=" notlive-node"></span>
                )}{" "}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: "20px",
              display: "flex",
              // justifyContent: "center",
              alignItems: "center",
            }}
          >
            {blockNumber && (
              <div style={{ marginBottom: "16px", fontSize: "18px" }}>
                {" "}
                Blocknumber : {blockNumber}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
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
                  View & Copy Rpc
                </button>
                {showRpc && (
                  <div
                    style={{
                      backgroundColor: "#35384c",
                      fontSize: "14px",
                      padding: "10px 12px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <div>rpc.dev.buildbear.io/{nodeId} </div>{" "}
                    <button className="ide-button">Copy</button>{" "}
                  </div>
                )}

                <a
                  href={`https://explorer.dev.buildbear.io/${nodeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="ide-button">Go to Explorer</button>
                </a>
                <a
                  href={`https://faucet.dev.buildbear.io/${nodeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="ide-button">Got to Faucet</button>
                </a>
              </>
            ) : (
              ""
            )}
          </div>
          {/* <button
            onClick={() => {
              getNodeDetails();
            }}
            className="ide-button"
          >
            Get Details
          </button> */}
        </div>
      </header>
    </div>
  );
}

export default App;
