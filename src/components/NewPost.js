import React, { useRef, useState } from 'react'
import { useMoralis, useMoralisFile } from 'react-moralis'
import BottomNav from './common/BottomNav'
import Blog from './common/Blog'
import Header from './common/Header'
import BundledEditor from './common/BundledEditor'
import { Button, Container, Card } from '@mui/material'
import { saveAs } from 'file-saver'

const NewPost = () => {
  const [itemName, setItemName] = useState()
  const [description, setDescription] = useState()
  const [userFile, setUserFile] = useState(null)
  const [url, setUrl] = useState('')
  const [hash, saveHash] = useState()
  const { user, Moralis, Web3 } = useMoralis()
  const { isUploading, moralisFile, saveFile } = useMoralisFile()
  const [modalOpened, setModalOpened] = useState(false)

  const editorRef = useRef(null)
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  const handleItemName = (e) => {
    const input = e.target.value
    setItemName(input)
  }
  const handleDesc = (e) => {
    const input = e.target.value
    setDescription(input)
  }
  const handleFile = async (e) => {
    var text = editorRef.current.getContent()
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const name = 'lol'
    var file = await blob.text()
    // saveAs(blob, name)
    const moralisSave = new Moralis.File(name, blob)
    console.log('moralisSave: ', moralisSave)
    await moralisSave.saveIPFS()
    console.log('moralisSave2: ', moralisSave.ipfs(), moralisSave.hash())
  }

  async function ipfsPush() {}

  return (
    <>
      <Header title="The Keychaxn" />
      <BundledEditor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>Create your post...</p>"
        init={{
          height: 750,
          menubar: false,
          plugins: [
            'advlist',
            'anchor',
            'autolink',
            'help',
            'image',
            'link',
            'lists',
            'searchreplace',
            'table',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      <Card sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* <Button variant="outlined" size="medium" onClick={log}>
          Log editor content
        </Button>{' '} */}
        <Button variant="outlined" size="medium" onClick={handleFile}>
          Authenticate Ownership
        </Button>{' '}
      </Card>
      <BottomNav />
    </>
  )
}

export default NewPost
