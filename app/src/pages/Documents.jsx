import {
  Grid,
  IconButton,
  Pagination,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { ListViewer } from '../components'
import { Edit, Delete } from '@mui/icons-material'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Documents = ({ setCurrentRoute }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const user = { id: 5 }

  const navigate = useNavigate()

  const { data, error, isLoading } = useSWR(
    `http://localhost:3001/document?user_id=${user.id}&page=${page}&limit=${limit}`,
    fetcher,
    { refreshInterval: 5000 }
  )

  const location = useLocation()
  setCurrentRoute(location.pathname)

  // const editDocument = id => {
  //   alert(`Document ${id} edited!`)
  // }
  const deleteDocument = id => {
    alert(`Document ${id} deleted!`)
  }

  const columns = [
    { headerName: 'ID', key: '_id', id: true },
    { headerName: 'Title', key: 'title', id: false },
    { headerName: 'Content', key: 'content', id: false },
    { headerName: 'CreatedAt', key: 'createdAt', id: false },
    { headerName: 'UpdatedAt', key: 'updatedAt', id: false },
    {
      headerName: 'Actions',
      key: 'null',
      id: false,
      action: params => {
        return (
          <>
            <IconButton
              onClick={() => navigate(`/document/${params._id}`)}
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => deleteDocument(params._id)}
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <Delete />
            </IconButton>
          </>
        )
      }
    }
  ]

  // const rows = [
  //   {
  //     id: 1,
  //     title: 'Snow',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 2,
  //     title: 'Lannister',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 3,
  //     title: 'Lannister',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 4,
  //     title: 'Stark',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 5,
  //     title: 'Targaryen',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 6,
  //     title: 'Melisandre',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 7,
  //     title: 'Clifford',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 8,
  //     title: 'Frances',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   },
  //   {
  //     id: 9,
  //     title: 'Roxie',
  //     content: 'Aqui será o conteúdo do meu documento',
  //     createdAt: '2022-12-15T13:43:00.522+00:00'
  //   }
  // ]

  const props = {
    style: {
      marginTop: '20px'
    },
    columns: columns,
    rows: data !== undefined ? data.rows : [],
    isLoading: isLoading
  }

  const handleChange = (event, value) => {
    setPage(value)
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={0} md={1}></Grid>
        <Grid item xs={12} md={10}>
          <Stack
            sx={{
              maxHeight: 'calc(100vh - 188.5px    )'
            }}
          >
            {!error && data !== undefined ? (
              <ListViewer {...props} />
            ) : error ? (
              'Um erro ocorreu'
            ) : (
              'Nenhum dado encotrado'
            )}
          </Stack>
        </Grid>
        <Grid item xs={0} md={1}></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={0} md={1}></Grid>
        <Grid
          item
          xs={12}
          md={7}
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Stack spacing={2} alignItems="left">
            <Pagination
              count={data?.count}
              color="primary"
              onChange={handleChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right'
          }}
        >
          <Stack spacing={2} alignItems="right">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="limit-page-label">Itens</InputLabel>
              <Select
                labelId="limit-page-label"
                id="limit-page"
                value={limit}
                onChange={event => {
                  setLimit(event.target.value)
                }}
                label="Limit"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={0} md={1}></Grid>
      </Grid>
    </>
  )
}

export default Documents
