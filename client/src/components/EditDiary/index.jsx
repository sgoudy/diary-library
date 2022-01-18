import '../EditDiary/index.css'
import 'quill/dist/quill.snow.css' // Add css for snow theme

import { ArrowBack, Delete, Menu, Save } from '@material-ui/icons'
import { Button, Grid, TextField, Typography, Divider } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'

import Api from '../../Api'
import { AuthContext } from '../../context/AuthContext'
import React from 'react'
import { useQuill } from 'react-quilljs'

export default function EditDiary(props) {
  const [err, setErr] = useState('')
  const [editMode, setEditMode] = useState(true)
  function setEnable(){}
  function setBookTitle(){}
  const { user } = useContext(AuthContext)

  /* Basic quill setup */
  const { quill, quillRef } = useQuill()
 
  /**
     * Fetch book ID
     */
  let bookID
  for (let j = 0; j < props.coll.length; j++) {
    bookID = props.coll[props.collid].books[props.id]?.id
  }

 /**
   * Turns whichever one is clicked into a TextField for editing
   */
  const editBookToggle = () => {
    setEditMode(!editMode)
    setEnable(quill.enable())
  }

  /**
   * API call to get book and display contents
   */
  const fetchData = () => {
    if(bookID){
    if (quill && props.body !== null) {
      setEnable(quill.enable(false))
      const apiQuery = Api.getBase() + `book/${bookID}/${user.id}`
      Api.query(apiQuery, Api.get, (response, status, responseCode) => {
        if (responseCode === 200 && response.body) {
          quill.setContents(JSON.parse(props.body))
          setBookTitle(response?.title)
        } else if (responseCode === 200) {
          if (response.content) {
            quill.setContents(JSON.parse(response.content))
          }
        } else {
          props.closeBook()
          console.log('Edit Book Error: ' + response.message)
        }
      })
    }
  }}

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [quill, bookID, user.id])

  /**
   * Update book via form inputs
   * @param {e} e
   */
  const saveBook = e => {
    editBookToggle()
    setEnable(quill.enable(false))
    //reset error
    setErr(false)
    e.preventDefault()
    const data = new FormData()
    let title = document.getElementById('newBookTitle').value
    if (title === ''){
      title = props.title
    }
    const content = document.createElement('INPUT')
    content.setAttribute('type', 'text')
    const userid = document.createElement('INPUT')
    userid.setAttribute('type', 'text')
    const bookid = document.createElement('INPUT')
    bookid.setAttribute('type', 'text')

    data.append('userid', user.id)
    data.append('bookid', bookID)
    data.append('title', title)    
    data.append('content', JSON.stringify(quill.getContents()))

    const apiQuery = Api.getBase() + `book/update`

    Api.query(apiQuery, Api.put, data, (response, status, responseCode) => {
      if (responseCode !== 200) {
        setErr(response.message)
        console.log('ERROR: ' + response.message)
        return
      } else {
        window.alert('Book was saved successfully.')
      }
    })
  }

  /**
   * Back button with edit tracking
   */
  const goBack = () => {
    const editor = document.getElementById('editor')
    editor.contentEditable = false;
    if (!editMode) {
      const answer = window.confirm('Unsaved changes may be lost. Are you sure you want to leave?')
      if (answer) {
        props.closeBook()
      }
    } else {
      props.closeBook()
    }
  }

  /**
   * Delete call to API
   */
  const deleteBook = () => {
    setErr(false)
    const answer = window.confirm(
      'Are you sure you want to delete this book? This action cannot be undone',
    )
    if (answer) {
      const data = new FormData()
      const userid = document.createElement('INPUT')
      userid.setAttribute('type', 'text')
      const bookid = document.createElement('INPUT')
      bookid.setAttribute('type', 'text')
      const collid = document.createElement('INPUT')
      collid.setAttribute('type', 'text')

      data.append('userid', user.id)
      data.append('bookid', bookID)
      data.append('collid', props.coll[props.collid].id)

      const apiQuery = Api.getBase() + `book/delete`

      Api.query(apiQuery, Api.delete, data, (response, status, responseCode) => {
        if (responseCode !== 200) {
          setErr(response.message)
          console.log('ERROR: ' + response.message)
          return
        } else {
          props.closeBook()
          window.alert('Book deleted.')
        }
      })
    }
  }

  return (
    <>
      <Divider />
    <Grid container justifyContent="center" style={{ paddingTop: '10px' }}>
      <Grid
        container
        className="header-text"
        alignItems="center"
        component="form"
        id="form"
        onSubmit={saveBook}
      >
        <Grid item xs={3} style={{ paddingLeft: '50px' }}>
          <Button className="button" variant="contained" onClick={goBack}>
            <ArrowBack fontSize="small" /> Back to Books
          </Button>
        </Grid>
        <Grid item xs={7}>
          <TextField
            title="title"
            name={props.title}
            id="newBookTitle"
            label={props.title}
            variant="outlined"
            inputProps={{ 'data-testid': 'title-input' }}
            disabled = {editMode}
          />
        </Grid>
        <Grid item xs={2}>
          {editMode ? (
            <Button
              variant="contained"
              onClick={editBookToggle}
              startIcon={<Menu />}
            >
              Edit
            </Button>
          ) : (
            <Button variant="contained" onClick={saveBook} startIcon={<Save />}>
              Save
            </Button>
          )}
        </Grid>
        {err !== '' && (
          <Grid item xs={12}>
            <Typography variant="overline" style={{ color: 'red' }}>
              {err}
            </Typography>
          </Grid>
        )}
      </Grid>

      <div id="editor" title="editor">
        <div style={{ width: 'auto', height: 450 }}>
          <div ref={quillRef} />
        </div>
      </div>
      {!editMode &&
        <Grid container style={{  marginTop: '50px' }} className="delete">
        <Button style={{ color: 'red' }} onClick={deleteBook}>
          <Typography variant="overline">Delete Book</Typography>
          <Delete fontSize="small" />
        </Button>
      </Grid>
      }
    </Grid>
    </>
  )
}