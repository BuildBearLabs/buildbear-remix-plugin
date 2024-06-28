import React from "react";
import { getAnalytics, postCreateNode } from "../Api";
import {
  Form,
  InputGroup,
  Tooltip,
  Button,
  OverlayTrigger,
} from "react-bootstrap";

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
    await getAnalytics(res?.data?.sandboxId, "createSandbox");
  }

  return (
    <>
      <div className="text-uppercase mb-3">
        {/* <Container> */}
        <Form.Group>
          <Form.Label>BLOCKCHAIN</Form.Label>
          <InputGroup.Append>
            <Form.Control
              as="select"
              className="form-control custom-select "
              value={selectedChain}
              onChange={handleChainChange}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </Form.Control>
            <InputGroup.Append>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip style={{ borderBottom: "0px solid #fff" }} id="">
                    Select a blockchain to fork from
                  </Tooltip>
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <i
                    className=" ml-2 fas fa-info p-1  "
                    style={{ fontSize: "0.8rem" }}
                  />
                </div>
              </OverlayTrigger>
            </InputGroup.Append>
          </InputGroup.Append>
        </Form.Group>
        <Form.Group>
          {selectedChain && (
            <>
              <Form.Label>TESTNET/MAINNET</Form.Label>
              <InputGroup.Append>
                <Form.Control
                  as="select"
                  className="form-control custom-select "
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
                </Form.Control>
                <InputGroup.Append>
                  <OverlayTrigger
                    placement="top"
                    id="overlay-connect"
                    overlay={
                      <Tooltip id="" style={{ borderBottom: "0px solid #fff" }}>
                        Choose between testnet/mainnet
                      </Tooltip>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <i
                        className=" ml-2 fas fa-info p-1  "
                        style={{ fontSize: "0.8rem" }}
                      />
                    </div>
                  </OverlayTrigger>
                </InputGroup.Append>
              </InputGroup.Append>
            </>
          )}
        </Form.Group>
        <Form.Group>
          {selectedOption && !nodeId && (
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                createNode();
                setLoader(true);
              }}
              className="btn btn-primary mt-4 d-flex justify-content-center w-32"
              style={{
                width: "138px",
              }}
            >
              {loader ? <div className="loader"></div> : "Create Sandbox"}
            </Button>
          )}
        </Form.Group>

        {/* </Container> */}
      </div>
    </>
  );
};

export default CreateSandbox;
