const { expect, assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
  let simpleStorageFactory, simpleStorage
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = 0
    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString(), expectedValue) Does the same thing
  })
  it("Should update when we call store", async function () {
    const expectedValue = "21"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
  it("Should have a person added to the people array when we call addPerson", async function () {
    const expectedPerson = {
      favoriteNumber: 21,
      name: "Aaron",
    }
    const transactionResponse = await simpleStorage.addPerson(
      expectedPerson.name,
      expectedPerson.favoriteNumber
    )
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.nameToFavoriteNumber("Aaron")
    assert.equal(currentValue, expectedPerson.favoriteNumber)
  })
})
