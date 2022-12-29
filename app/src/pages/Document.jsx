import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
// import { userIsLoggedIn } from '../services/auth'

import { Editor } from '@tinymce/tinymce-react'

import { TextField } from '../components'
import { Box, Button } from '@mui/material'

import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Document = ({ setCurrentRoute }) => {
  const editorRef = useRef(null)

  const location = useLocation()
  setCurrentRoute(location.pathname)

  const navigate = useNavigate()
  const params = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { data } = useSWR(
    `http://localhost:3001/document/${params.id}`,
    fetcher,
    { refreshInterval: 5000 }
  )

  const loadingDocument = async () => {
    setTitle(data.document.title)
    setContent(data.document.content)
  }

  useEffect(() => {
    loadingDocument()
  }, [data])

  const updateDocument = () => {
    fetch(`http://localhost:3001/document/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title,
        content: editorRef.current.getContent()
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
  }

  // useEffect(() => {
  //   userIsLoggedIn(navigate, null)
  // }, [])

  return (
    <Box
      style={{
        padding: 20
      }}
    >
      <TextField
        style={{
          marginBottom: 16
        }}
        label={'Título'}
        fullWidth={true}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={content}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <Button variant="contained" onClick={updateDocument}>
        Clicar
      </Button>
    </Box>
  )
}

export default Document
