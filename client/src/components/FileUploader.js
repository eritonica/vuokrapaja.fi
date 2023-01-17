import { useState } from 'react';
import { Container, Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Unstable_Grid2';

import { useSelector } from 'react-redux';

const FileUploader = (props) => {
  const token = useSelector((state) => state.app.token);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleFileUpload = async () => {
    // console.log("Uploading files: ", files);
    const formData = new FormData();
   
    let uri = '/api/uploads';
    if(props.multiple) {
      files.forEach((file, i) => {
        formData.append('files', file);
      });
      uri += '/multiple';
    } else {
      formData.append('file', files[0]);
      uri += '/single';
    }
    let result = await fetch(uri, {
      method: 'POST',
      headers: {
        'token': token,
      },
      body: formData,
    });
    // console.log(result);
    let body = await result.json();
    if(body.message === "File type not allowed.") {
      // console.log("File type not allowed.");
      return;
    } else {
      props.fileUploadCallback(body);
      return body;
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form">
        <Typography variant="h4" component="h1" gutterBottom>
          File Uploader
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button variant="contained" component="label" sx={{mt:2,}}>
              Select files
              { (props.multiple) 
                ? <input hidden
                    type="file"
                    name="file"
                    multiple
                    accept = "image/*"
                    onChange={handleFileChange}
                    sx={{ display: 'none' }} /> 
                : <input hidden
                    type="file"
                    name="file"
                    accept = "image/*"
                    onChange={handleFileChange}
                    sx={{ display: 'none' }} /> 
              }
            </Button>
          </Grid>
          <Grid item xs={9}>
            <List dense={true}>
              { files.length > 0 ? files.map((file) => {
                return (
                  <ListItem key={file.name}>
                    <ListItemIcon>
                      <CloudUploadIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={(file.size / 1024 / 1024).toFixed(3) + ' MB'}
                    />
                  </ListItem>
                )
              }) 
              : <ListItem key="empty">
                  <ListItemIcon>
                    <CloudUploadIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="No files selected"
                    secondary="Select files to upload, then click Upload button."
                  />
                </ListItem> 
              }
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="button" onClick={handleFileUpload}>
              Upload
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )

}

export default FileUploader;