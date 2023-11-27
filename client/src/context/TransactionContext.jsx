import React, { useEffect, useState } from 'react'
import { contractABI, contractAddress } from '../utils/constants'

const { ethers } = require('ethers')
export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSinger()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )

  console.log({
    provider,
    signer,
    transactionContract,
  })
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert('Please install metamask')

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log('checkIfWalletIsConnected', accounts)
      if (accounts.length) {
        setCurrentAccount(accounts[0])
      }
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum oject')
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const accounts = await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      console.log('account', accounts)
      console.log('ethereum', ethereum)
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)

      throw new Error(error.message)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </TransactionContext.Provider>
  )
}
