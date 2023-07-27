import { useState, useEffect } from 'react';
import { Grid, Paper } from "@mui/material"
import { IconButton } from "@mui/material"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * ImageList Component - A React component that displays a list of images along with navigation controls.
 *
 * @component
 * @example
 * return (
 *   <ImageList images={imageDataArray} />
 * );
 *
 * @param {Object} props - The component props.
 * @param {Array} props.images - An array of image objects to display in the list.
 * @returns {JSX.Element} A JSX Element representing the ImageList component.
 */
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

  /**
   * Handle click event when an image in the list is clicked.
   *
   * @param {Object} image - The image object that was clicked.
   */
  const onImageClick = (image) => {
    setImage(image);
  }

  /**
   * Handle click event when the back arrow button is clicked.
   * Move the image list one position back.
   */
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
  
  /**
   * Handle click event when the forward arrow button is clicked.
   * Move the image list one position forward.
   */
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
        <Grid item xs={12} sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
         }}>
          <img src={"/" + image.path} alt={image.name} height="400px" xs={12} />
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