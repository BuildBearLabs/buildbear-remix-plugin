
![buildbear](./src/BBLogo.svg)

# BuildBear Plugin for Remix

The BuildBear plugin for Remix IDE. It support for deploy and interacting on BuildBear Sandbox (BuildBear Node).

# Getting Started

First, clone the repository:

```
git clone https://github.com/BuildBearLabs/buildbear-remix-plugin
cd buildbear-remix-plugin
```

Install dependencies:

```
yarn install
```

Run the app:

```
yarn start
``` 

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Connect Plugin Locally inside Remix Ide

 You can view the changes you're making locally within Remix Ide by following step :
 1. In Remix, click on the Plugin Manager icon on the left-bottom side of the menu
 2. Towards the top, click on Connect to a Local Plugin.
 3. Fill the Details:
    - **Plugin Name** - BuildBear SandBox
    - **Url** - http://localhost:3000
    - **Connection Type** - iframe
    - **Location Type** - side panel (Left Side) 
 4. Click on **OK**
 5. A question mark icon will appear on the left side menu for the local plugin.
 6. Once the local plugin has been created, you can test the changes locally


##  How to use BuildBear Remix Ide Plugin (Sand Box)
1. Once your Sandbox is live, copy the RPC
2. Visit the 4th plugin "Deploy and Run Transactions"
3. Drop down on the Environment
4. Select "Custom External Http Provider"
5. In the input box "External HTTP Provider Endpoint, paste the RPC (copied in Step 1)
6. Your Remix IDE will be connected to the BuildBear Sandbox you just created.
<br/>
If you have any issues, you can reach out to us on team@buildbear.io or https://t.me/Web3_dApp_Developers

Additional Notes:
1. If you want to reset your sandbox, you can use the "Reset" button on the top-right corner of this plugin
