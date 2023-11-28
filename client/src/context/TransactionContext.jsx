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

    return transactionContract
  } catch (error) {
    console.error('Error in getEthereumContract:', error)
  }
}

const getLocalTransactionCount = localStorage.getItem('transactionCount')

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsloading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    getLocalTransactionCount || 0,
  )
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
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
      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      // send ethereum
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // HEX = 21000GWEI
            value: parsedAmount._hex,
          },
        ],
      })

      // add to blockchain
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      )

      // loading
      setIsloading(true)
      console.log(`Loading - ${transactionHash.hash}`)

      // add to blockchain success
      await transactionHash.wait()
      setIsloading(false)
      console.log(`Success - ${transactionHash.hash}`)

      // get transaction count
      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
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
