import React, { useEffect, useState } from 'react'
import { contractABI, contractAddress } from '../utils/constants'

const { ethers } = require('ethers')
export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  try {
    if (!window.ethereum) {
      console.log('Ethereum provider (ethereum) is undefined.')
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const getSigner = provider.getSigner()
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      getSigner,
    )

    console.log({
      provider,
      getSigner,
      transactionContract,
    })
  } catch (error) {
    console.error('Error in getEthereumContract:', error)
  }
}
console.log('contractAddress', contractAddress)
console.log('contractABI', contractABI)
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState({
    addressTo: 'test  ',
    amount: '0.001',
    keyword: 'test',
    message: 'test',
  })

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const accounts = await ethereum.request({ method: 'eth_accounts' })

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
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)

      throw new Error(error.message)
    }
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      // const { addressTo, amount, keyword, message } = formData
      getEthereumContract()
    } catch (error) {
      console.log(error)

      throw new Error(error.message)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
