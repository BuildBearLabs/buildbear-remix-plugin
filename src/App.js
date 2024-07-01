import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@remixproject/plugin-webview";
import useSWR from "swr";
import Cookies from "universal-cookie";
import { PluginClient } from "@remixproject/plugin";
import { getChainsList, getNodeDetails } from "./Api";
import Footer from "./components/Footer";
import OptionsList from "./components/OptionsList";
import Header from "./components/Header";
import { CreateSandbox } from "./components/CreateSandbox";
import SandboxDetails from "./components/SandboxDetails";

export const client = new PluginClient();
createClient(client);

function App() {
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedOption, setSelectedOption] = useState();
  const [chains, setChains] = useState([]);
  const [nodeId, setNodeId] = useState();
  const [loader, setLoader] = useState(false);
  const [live, setLive] = useState(false);
  const [showRpc, setShowRpc] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [metamaskLock, setMetamaskLock] = useState(true);

  useEffect(() => {
    let cookies = new Cookies();
    let installed = cookies.get("plugin-installed");
    if (!installed) {
      cookies.set("plugin-installed", "true");
      // track("Remix: Plugin Installed", {}, userData);
    }
    client.on("theme", "themeChanged", (theme) => {
      setTheme(theme?.quality ?? "dark");
    });
  });
  useEffect(() => {
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
    setLoader(false);
    setLive(false);
    setShowRpc(false);
  }
  function resetOnChangeOption() {
    setNodeId();
    setLoader(false);
    setLive(false);
    setShowRpc(false);
  }

  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
    setSelectedOption("");
    resetOnChangeOption();
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    resetOnChangeOption();
  };

  useEffect(() => {
    //Get chain details from the backend
    async function getChains() {
      const res = await getChainsList();
      setChains(res?.data);
      setSelectedChain(res?.data[0]?.id);
    }
    getChains();
  }, []);

  //Get Node details
  async function nodeDetails() {
    const res = await getNodeDetails(nodeId);
    if (res.status === 200) {
      setLive(true);
    }
  }

  //Checking Sandbox status in every 1 sec
  const containerApi = useSWR(
    nodeId && !live ? "/user/container" : null,
    nodeDetails,
    {
      refreshInterval: 1000,
    }
  );

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
          <Header resetButton={resetButton} theme={theme} />
          <CreateSandbox
            selectedChain={selectedChain}
            handleChainChange={handleChainChange}
            chains={chains}
            selectedOption={selectedOption}
            handleOptionChange={handleOptionChange}
            setLoader={setLoader}
            loader={loader}
            setNodeId={setNodeId}
            nodeId={nodeId}
          />
          <div style={{}}>
            {/* SandboxId and Status */}
            <SandboxDetails nodeId={nodeId} live={live} />
            {live && (
              // Explore, Faucet, Rpc, Metamask
              <OptionsList
                nodeId={nodeId}
                setShowRpc={setShowRpc}
                showRpc={showRpc}
                checkMetamaskLock={checkMetamaskLock}
              />
            )}
          </div>
        </div>
        <Footer />
      </header>
    </div>
  );
}

export default App;
