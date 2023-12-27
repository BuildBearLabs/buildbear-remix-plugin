import React from "react";
import { Button } from "react-bootstrap";
import { testnetName } from "./utils/helper";
const copy = require("copy-to-clipboard");
const { ethers } = require("ethers");

const OptionsList = ({ nodeId, setShowRpc, showRpc, checkMetamaskLock }) => {
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

  return (
    <div
      style={{
        display: "grid",
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
                copy(`https://rpc.${process.env.REACT_APP_BASE_URL}/${nodeId}`);
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
                width: "100%",
                alignItems: "center",
                display: "flex",
                padding: "8px 0px",
                justifyContent: "space-between",
              }}
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
  );
};

export default OptionsList;
