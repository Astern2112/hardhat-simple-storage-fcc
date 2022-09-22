// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying Contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  // no private key/ ABI
  console.log(`Deployed contract to: ${simpleStorage.address}`)
  //what happens when we deploy to our hardhat network
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations")
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  //get current Value
  const currentValue = await simpleStorage.retrieve()
  console.log(`current value is ${currentValue}`)

  //update current value
  const transactionResponse = await simpleStorage.store("7")
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`The updated value is ${updatedValue}`)
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
