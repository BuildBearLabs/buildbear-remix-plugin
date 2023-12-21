import axios from "axios";

export async function getChainsList() {
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
    return res;
  } catch (_) {
    return {
      data: [],
    };
  }
}

export async function postCreateNode(selectedOption) {
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

    return res;
  } catch (_) {
    return {
      data: {},
    };
  }
}

export async function getNodeDetails(nodeId) {
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

    return res;
  } catch (_) {
    return {
      data: {},
    };
  }
}
