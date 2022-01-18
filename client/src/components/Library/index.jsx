import '../Library/index.css'

import { Add, Delete, Menu, Save } from '@material-ui/icons'
import {
  Button,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import { ThemeProvider, createTheme, styled } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'

import AddBook from '../AddBook'
import AddCollection from '../AddCollection'
import Api from '../../Api'
import { AuthContext } from '../../context/AuthContext'
import EditDiary from '../EditDiary'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 50,
  width: 50,
}))

const lightTheme = createTheme({ palette: { mode: 'light' } })

export default function Library() {
  const { user } = useContext(AuthContext)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedBookIndex, setSelectedBookIndex] = useState(0)
  const [collections, setCollections] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [bookTitle, setBookTitle] = useState(false)
  const [body, setBody] = useState('')

  const handleSetBookTitle = (title) => setBookTitle(title)

  /** View Book Modal Open/Close */
  const [openViewBook, setOpenViewBook] = useState(false)
  const handleOpenViewBook = (e, i, title, body) => {
    setSelectedBookIndex(i)
    setOpenViewBook(true)
    handleSetBookTitle(title)
    setBody(body)
  }
  const closePopupViewBook = () => {
    setOpenViewBook(false)
  }

  /** Collection Toggling Feature */
  const handleListItemClick = (e, i) => {
    setSelectedIndex(i)
    closePopupViewBook()
    getBooks(collections[i])
  }

  /** Add Book Modal Open/Close */
  const [openAddCollection, setAddCollection] = useState(false)
  const handleOpenAddCollection = () => setAddCollection(true)
  const closeAddCollection = () => setAddCollection(false)

  /** Add Book Modal Open/Close */
  const [openNewBook, setOpenNewBook] = useState(false)
  const handleOpenNewBook = () => setOpenNewBook(true)
  const closePopupNewBook = () => setOpenNewBook(false)

  /**
   * Returns books based on selected Collection :)
   */
  const getBooks = () => {
    if (collections[selectedIndex]?.books?.length > 0) {
      return (
        <ThemeProvider theme={lightTheme}>
          {collections[selectedIndex].books.map((book, i) => {
            return (
              <Item
                key={i}
                elevation={1}
                className="book"
                selected={selectedIndex === i}
                onClick={e => handleOpenViewBook(e, i, book.title, book.body)}
              >
                {book.title}
              </Item>
            )
          })}
        </ThemeProvider>
      )
    } else {
      return
    }
  }

  /**
   * API query
   */
  const fetchData = () => {
    const apiQuery = Api.getBase() + `collections/${user.id}`
    try {
      Api.query(apiQuery, Api.get, (response, status, responseCode) => {
        if (responseCode !== 200) {
          setOpenViewBook(false)
          console.log('Library Error: ' + response.message)
          return
        } else {
          setCollections(response.collections)
        }
      })
    } catch (err) {
      console.log('Error Handler: ' + err)
    }
  }

  /**
   * Delete Collection
   */
  const deleteCollection = () => {
    const answer = window.confirm('Are you sure you want to delete the entire collection?')
    if (answer) {
      const data = new FormData()

      data.append('collid', collections[selectedIndex].id)
      data.append('userid', user.id)

      const apiQuery = Api.getBase() + `collection/delete`

      Api.query(apiQuery, Api.delete, data, (response, status, responseCode) => {
        if (responseCode !== 200) {
          console.log('Error: ' + response.message)
          return
        } else {
          window.alert('Collection deleted.')
          setSelectedIndex(null)
          fetchData()
          setEditMode(false)
        }
      })
    }
  }

  /**
   * Returns Collections from API
   */
  useEffect(
    () => fetchData(), // eslint-disable-next-line
    [openViewBook, editMode],
  )

  /**
   * Renders the Collections
   */
  const setCollectionsDisplay = () => {
    return (
      <List component="nav" id="collections">
        {collections.map((collection, i) => {
          return (
            <ListItem
              id="collection"
              className="list"
              key={i}
              selected={selectedIndex === i}
              onClick={e => handleListItemClick(e, i)}
            >
              {editMode && i === selectedIndex ? (
                <Grid item>
                  <TextField
                    component="form"
                    onSubmit={editCollectionName}
                    name={collection.id}
                    id="newCollectionName"
                    label={collection.title}
                    variant="outlined"
                    inputProps={{ autoComplete: 'off' }}
                  />
                  <Delete
                    fontSize="medium"
                    style={{ position: 'absolute', right: 0, top: 25, color: 'red' }}
                    onClick={deleteCollection}
                  />
                </Grid>
              ) : (
                <ListItemText
                  primary={collection.title}
                  style={{ paddingTop: '8px', paddingBottom: '8px' }}
                />
              )}
            </ListItem>
          )
        })}
      </List>
    )
  }

  /**
   * Turns whichever one is clicked into a TextField for editing
   */
  const editCollectionsToggle = () => {
    setEditMode(!editMode)
  }

  /**
   * Grabs input and sends to DB for updating
   */
  const editCollectionName = e => {
    e.preventDefault()
    const data = new FormData();
    let name = document.getElementById('newCollectionName').value
    if (name === '') {
      name = collections[selectedIndex].title
    }
    const id = document.getElementById('newCollectionName').getAttribute('name')
    editCollectionsToggle()
    const input = document.createElement('INPUT')
    input.setAttribute('type', 'text')
    input.value = user.id

    data.append('userid', user.id)
    data.append('title', name)
    data.append('collid', id)

    const apiQuery = Api.getBase() + `collections/title`

    Api.query(apiQuery, Api.put, data, (response, status, responseCode) => {
      if (responseCode !== 200) {
        return
      } else {
        fetchData()
      }
    })
  }

  return (
    <Grid container alignItems="center" justifyContent="center" className="library-container">
      <Grid container spacing={2} style={{ margin: '20px' }} alignItems="center">
        {/* // Admin panel  */}
        <Grid item xs={2}>
          <Typography className="leftHeader" variant="h5">
            Collections
          </Typography>
        </Grid>
        <Grid item xs={2}>
          {!editMode ? (
            <Button
              variant="contained"
              onClick={editCollectionsToggle}
              startIcon={<Menu />}
              disabled={collections?.length === 0}
            >
              Edit
            </Button>
          ) : (
            <Button variant="contained" onClick={editCollectionName} startIcon={<Save />} type="submit" >
              Save
            </Button>
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography className="rightHeader" variant="h2">
            {selectedIndex !== null ? collections[selectedIndex]?.title : null}
          </Typography>
        </Grid>

        {/* Dont show buttons to decrease distractions while editing */}
        {!openViewBook && (
          <>
            <Grid container item xs={2} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleOpenNewBook}
                disabled={collections?.length === 0 || selectedIndex === null}
              >
                <Add size="medium" />
                NEW BOOK
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      {openNewBook ? (
        <AddBook
          open={openNewBook}
          closeBook={closePopupNewBook}
          coll={collections}
          id={selectedIndex}
          fetchData={fetchData}
        />
      ) : null}

      {/* // Collections */}
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={3} className="leftSide">
          {setCollectionsDisplay()}

          <Fab variant="extended" style={{ width: '100%' }} onClick={handleOpenAddCollection}>
            <Add size="medium" />
            New Collection
          </Fab>

          {openAddCollection ? (
            <AddCollection
              open={openAddCollection}
              closeBook={closeAddCollection}
              coll={collections}
              collid={selectedIndex}
              fetchData={fetchData}
            />
          ) : null}
        </Grid>

        {/* Books or Editor */}
        <Grid item xs={9} className={openViewBook ? 'view-books' : 'books'}>
          {openViewBook ? (
            <EditDiary
              open={openViewBook}
              closeBook={closePopupViewBook}
              coll={collections}
              collid={selectedIndex}
              id={selectedBookIndex}
              title={bookTitle}
              body={body}
            />
          ) : (
            getBooks()
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}
