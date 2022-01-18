import '../AddCollection/index.css'

import Api from '../../Api'
import { AuthContext } from '../../context/AuthContext'

import { Button, Grid, Typography, TextField, Fab, Modal, Box} from '@material-ui/core'
import { Add, Close} from '@material-ui/icons'
import {useContext} from "react"

export default function AddCollection(props) {

    const {user} = useContext(AuthContext);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


  /**
     * Adds collection to User database
     * @param {event} e form submission event
     */
   const addCollection = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = document.getElementById("title").value;

    data.append('userid', user.id);
    data.append('title', title);

    const apiQuery = Api.getBase() + `collections/new`;

    Api.query(apiQuery, Api.post, data, (response, status, responseCode) => {
        if (responseCode !== 201) {
           return;
        } else {
            props.fetchData();
            props.closeBook();
        }
    });
}


    return (
      
        <Modal
            open={props.open}
            onClose={props.closeBook}
        >
            <Box sx={style} component="form" onSubmit={addCollection}>
                <Grid container item spacing={2} className="closePopup">
                    <Typography >Add New Collection</Typography>
                    <Button onClick={props.closeBook} >
                        <Close />
                    </Button>
                </Grid>
                <Grid container item spacing={2}>
                    <TextField
                        title="title"
                        id="title"
                        className="title"
                        required
                        label="Title"
                        variant="outlined"
                        inputProps={{ "data-testid": "add-collection-input", autoComplete: "off" }}
                    />
                </Grid>

                <Grid container item style={{ marginTop: '20px' }} >

                    <Fab type="submit" color="primary" aria-label="add" >
                        <Add />
                    </Fab>
                </Grid>
            </Box>
        </Modal>
    )
}
