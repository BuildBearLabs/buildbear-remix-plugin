import React from "react";
import { testnetName } from "./utils/helper";

const SandboxDetails = ({nodeId, live}) => {
  return (
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
  );
};

export default SandboxDetails;
