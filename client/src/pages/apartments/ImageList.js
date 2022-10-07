import { useState, useEffect } from 'react';
import { Grid, Paper } from "@mui/material"
import { IconButton } from "@mui/material"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImageList = ({ images }) => {
  const [image, setImage] = useState((images === undefined) ? "" : images[0]);
  const [imageList, setImageList] = useState((images === undefined) ? { 
    images: [],
    index: 0,
    start: 0,
    end: 0
  } : {
    images: images,
    index: 0,
    start: 0,
    end: 5
  });

  const onImageClick = (image) => {
    setImage(image);
  }

  const onBackClick = () => {
    if (imageList.index > 0) {
      setImageList({
        images: imageList.images,
        index: imageList.index - 1,
        start: imageList.start - 1,
        end: imageList.end - 1
      });
    }
  }

  const onForwardClick = () => {
    if (imageList.index < imageList.images.length - 1) {
      setImageList({
        images: imageList.images,
        index: imageList.index + 1,
        start: imageList.start + 1,
        end: imageList.end + 1
      });
    }
  }
  
  return (
    <Paper sx={{ p: 2, margin: 'auto', flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <img src={"/" + image.path} alt={image.name} width="100%" />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={1} sx={{ marginTop: "20px" }}>
              <IconButton onClick={onBackClick}>
                <ArrowBackIosIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={2}>
                {imageList.images.map((image, index) => (
                  (index >= imageList.start && index <= imageList.end) && (
                    <Grid item xs={2} key={index}>
                      <img src={"/" + image.path} alt={image.name} width="100%" onClick={() => onImageClick(image)} />
                    </Grid>
                  )
                ))}
              </Grid>
            </Grid>
            <Grid item xs={1} sx={{ marginTop: "20px", textAlign: "right"}}>
              <IconButton onClick={onForwardClick}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ImageList;