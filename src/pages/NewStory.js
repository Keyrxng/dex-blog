import { useState } from 'react'
import {
  useMoralis,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from 'react-moralis'
import swal from 'sweetalert'
import './NewStory.css'
import abi from '../abis/BlogNFT.json'

const NewStory = () => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const { saveFile } = useMoralisFile()
  const { Moralis, account, isWeb3Enabled, enableWeb3 } = useMoralis()
  const contractPlug = useWeb3ExecuteFunction()

  const mint = async (account, uri) => {
    let options = {
      contractAddress: '0x03CbFEf147843a1A98882964f234C1BEEc8B4693',
      functionName: 'safeMint',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
            {
              internalType: 'string',
              name: '_uri',
              type: 'string',
            },
          ],
          name: 'safeMint',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ],
      params: {
        _to: account,
        _uri: uri,
      },
      msgValue: Moralis.Units.ETH('0.01'),
    }

    let options1 = {
      contractAddress: '0xEA5e2D4CaAeD0520a38EcCBbc175E857AB14bD16',
      functionName: 'safeMint',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'uri',
              type: 'string',
            },
          ],
          name: 'safeMint',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ],
      params: {
        to: account,
        uri: uri,
      },
      msgValue: Moralis.Units.ETH(1),
    }

    console.log('test')
    await contractPlug.fetch({
      params: options,
      onSuccess: () => {
        alert('Successful mint', { icon: 'success' })
        setText('')
        setTitle('')
      },
      onError: (error) => {
        console.log(error, { icon: 'warning' })
      },
    })
  }

  const uploadFile = async (event) => {
    if (!isWeb3Enabled) {
      enableWeb3()
    }
    console.log(isWeb3Enabled)
    event.preventDefault()
    const textArray = text.split()
    const metadata = {
      title,
      text: textArray,
    }

    try {
      const res = await saveFile(
        'myblog.json',
        { base64: btoa(JSON.stringify(metadata)) },
        {
          type: 'base64',
          saveIPFS: true,
        },
      )
      const nftResult = await uploadNftMetadata(res.ipfs())
      await mint(account, nftResult.ipfs())
      //   swal(
      //     'Here is your censorship resistant url to your blog piece: ',
      //     nftResult.ipfs(),
      //     { icon: 'success' },
      //   )
    } catch (error) {
      console.log(error.message, { icon: 'warning' })
    }
  }

  const uploadNftMetadata = async (url) => {
    const metadataNft = {
      image:
        'https://ipfs.io/ipfs/QmWEsG4ayh75BMk2H1CowAdALPjsi3fD7CSZ6qxNM1yNnz/image/moralis.png',
      description: title,
      externalUrl: url,
    }
    const resultNft = await saveFile(
      'metadata.json',
      { base64: btoa(JSON.stringify(metadataNft)) },
      {
        type: 'base64',
        saveIPFS: true,
      },
    )

    return resultNft
  }

  return (
    <>
      <div>
        <form onSubmit={uploadFile} className="writeForm">
          <div className="writeFormGroup">
            <input
              className="writeInput"
              placeholder="Title"
              type="text"
              autoFocus={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="writeFormGroup">
            <textarea
              className="writeInput writeText"
              placeholder="tell your story..."
              autoFocus={true}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button className="writeSubmit" type="submit">
            Publish
          </button>
        </form>
      </div>
    </>
  )
}

export default NewStory
