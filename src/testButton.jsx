import React, { useEffect, useState } from "react";
import { createClient } from "@remixproject/plugin-webview";
import { PluginClient } from "@remixproject/plugin";

// const client = PluginClient();
// createClient(client);

const client = createClient();

const TestButton = () => {

    
    useEffect(() => {
        console.log("client", client)

        // client.on('fileManager', 'statusChanged', (status) => {
        //     // Do Something 
        //     console.log("status", status)
            
        //   })
    }, [])




  const environmentConfig = {
    name: "Buildbear Rpc",
    displayName: "Buildbear Rpc",
    url: "https://rpc.buildbear.io/greasy-yoda-2bae1861", 
    chainId: 1337, 
    networkId: 1337,
    options: {},
    dataId: '',
    fork: false,
    isInjected : false,
    isVM: false,
    title: "",
    init:  () =>  {
      
    },
    provider: {
        sendAsync (payload) {
            console.log("payload", payload)
          }
    }
 
   

  };
  const handleCustomRequest = async () => {
    client
      .call('blockchain', 'addProvider', environmentConfig)
      .then(() => {
        console.log("Environment added successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <button onClick={()=> {handleCustomRequest()}}>Send Custom Request</button>
    </div>
  );
};

export default TestButton;
