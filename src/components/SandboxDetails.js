import React from "react";
import { testnetName } from "./utils/helper";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
const SandboxDetails = ({ nodeId, live }) => {
  return (
    <div style={{ fontSize: "20px" }}>
      {nodeId && <div className="  mt-0 border-bottom mb-3"></div>}

      {nodeId && (
        <div>
          <div
            className="d-flex flex-column justify-content-start mb-3"
            style={{ fontSize: "11px", gap: "10px" }}
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
                fontSize: "11px",
                gap: "10px",
                alignItems: "center",
              }}
              className="d-flex flex-row gap-2 justify-content-between mb-1 pt-1"
            >
              <div className="text-uppercase"> Sandbox Status : </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                {" "}
                {live ? (
                  ""
                ) : (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip style={{ borderBottom: "0px solid #fff" }}>
                        Kindly wait as the sandbox is being created.
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
                      <i className=" ml-2 fas fa-info-circle   " />
                    </div>
                  </OverlayTrigger>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "col",
                    alignItems: "center",
                    float: "left",
                    gap: "10px",
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
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default SandboxDetails;
