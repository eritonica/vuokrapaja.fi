import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Unstable_Grid2';

const FileUploader = (props) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  useEffect(() => {
    console.log(files[0]);
  }, [files]);

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('files', files);
  };

  return (
    <Container maxWidth="md" component={Paper}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          File Uploader
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Button variant="contained" component="label" sx={{mt:2}}>
              Select files
              { (props.multiple) 
                ? <input hidden
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    sx={{ display: 'none' }}
                  /> 
                : <input hidden
                    type="file"
                    onChange={handleFileChange}
                    sx={{ display: 'none' }}
                  /> 
              }
            </Button>
          </Grid>
          <Grid item xs={10}>
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
            <Button fullWidth variant="contained" color="primary" onClick={handleFileUpload}>
              Upload
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )

}

export default FileUploader;