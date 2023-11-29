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
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [transactions, setTransactions] = useState([])
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

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract()

        const availableTransactions = await transactionsContract.getAllTransactions()

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000,
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          }),
        )

        console.log(structuredTransactions)

        setTransactions(structuredTransactions)
      } else {
        console.log('Ethereum is not present')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        getAllTransactions()
      } else {
        console.log('No account Found')
      }
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum oject')
    }
  }

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract()
        const currentTransactionCount = await transactionsContract.getTransactionCount()

        window.localStorage.setItem('transactionCount', currentTransactionCount)
      }
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum object')
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
      setIsSuccess(false)
      setIsError(false)
      console.log(`Loading - ${transactionHash.hash}`)

      // add to blockchain success
      await transactionHash.wait()
      setIsloading(false)
      setIsSuccess(true)
      console.log(`Success - ${transactionHash.hash}`)

      // get transaction count
      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
    } catch (error) {
      console.log(error)
      setIsError(true)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkIfTransactionsExists()
  }, [transactionCount])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
        transactions,
        isLoading,
        isSuccess,
        isError,
        transactionCount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
