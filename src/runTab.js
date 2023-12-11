import React from "react"; // eslint-disable-line
import { ViewPlugin } from "@remixproject/engine-web";
import packageJson from '../package.json'
// import { version } from '../package.json';

const profile = {
  name: 'udapp',
  displayName: 'Deploy & run transactions',
  icon: 'assets/img/deployAndRun.webp',
  description: 'Execute, save and replay transactions',
  kind: 'udapp',
  location: 'sidePanel',
  documentation: 'https://remix-ide.readthedocs.io/en/latest/run.html',
  version: packageJson.version,
  maintainedBy: 'Remix',
  permission: true,
  events: ['newTransaction'],
  methods: [
    'createVMAccount',
    'sendTransaction',
    'getAccounts',
    'pendingTransactionsCount',
    'getSettings',
    'setEnvironmentMode',
    'clearAllInstances',
    'addInstance',
    'resolveContractAndAddInstance'
  ]
}

export class RunTab extends ViewPlugin {
  constructor({blockchain, config, fileManager, editor, filePanel, compilersArtefacts, networkModule, fileProvider}) {

    // super(profile)
    // // this.event = new EventManager()
    // this.config = config
    // this.blockchain = blockchain
    // this.fileManager = fileManager
    // this.editor = editor
    // this.filePanel = filePanel
    // this.compilersArtefacts = compilersArtefacts
    // this.networkModule = networkModule
    // this.fileProvider = fileProvider
    // // this.recorder = new Recorder(blockchain)
    // this.REACT_API = {}
    // // this.setupEvents()
    // this.el = document.createElement('div')

  
  }
  // setupEvents() {
  //   this.blockchain.events.on('newTransaction', (tx, receipt) => {
  //     this.emit('newTransaction', tx, receipt)
  //   })
  // }

  activate() {
    // this.call('blockchain', 'addProvider', {
    //   options: {},
    //   dataId: "",
    //   name: "buildbear",
    //   displayName: "buildbear",
    //   fork: "",
    //   isInjected: false,
    //   isVM: false,
    //   title: "",
    //   init: async function () {
    //     // const options = await udapp.call("Externasl", 'init')
    //     // if (options) {
    //     //   this.options = options
    //     //   if (options['fork']) this.fork = options['fork']
    //     // }
    //     return 
    //   },
    //   provider: {
    //     async sendAsync(payload, callback) {
    //     //   try {
    //     //     const result = await udapp.call(name, 'sendAsync', payload)
    //     //     callback(null, result)
    //     //   } catch (e) {
    //     //     callback(e)
    //     //   }
    //     }
      
    //   }
    // })
  }
  
  render() {
    return <div><button onClick={()=> { this.activate()}}>Test</button></div>;
  }
}
