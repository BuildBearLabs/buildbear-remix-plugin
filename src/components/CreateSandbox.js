import React from "react";
import { postCreateNode } from "../Api";

export const CreateSandbox = ({
  selectedChain,
  handleChainChange,
  chains,
  selectedOption,
  handleOptionChange,
  setLoader,
  loader,
  setNodeId,
  nodeId,
}) => {
  //Post container request
  async function createNode() {
    const res = await postCreateNode(selectedOption);
    console.log("post", res);
    setNodeId(res?.data?.sandboxId);
    setLoader(false);
  }

  return (
    <>
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
      <div
        style={{
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
    </>
  );
};

export default CreateSandbox;
