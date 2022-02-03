import React, { useEffect, useState } from 'react';
import './App.css';
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, 
  Box, 
  Card, CardMedia, Container, IconButton, Modal, Pagination, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface item{
  "albumId": number,
  "id": number,
  "title": string,
  "url": string,
  "thumbnailUrl": string
};

function App() {
  const [data, setData] = useState<item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [currentPageData, setCurrentPageData] = useState<item[]>([]);
  const [albumIds, setAlbumIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>('');
  const imgPerPage:number = 8; // сan be made dynamic for responsive design
  
  // data loading
  useEffect(() => {
    const apiUrl = `http://jsonplaceholder.typicode.com/photos`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((repos:item[]) => {
        setData(repos);
        setAlbumIds([...new Set(repos.map((i:item) => (i.albumId)))].map(String));
        console.log("Data received");
      });
  }, []); 

  // event handling
  useEffect(() => {
    let filteredData = data.slice();
    if (filter !== null)
      filteredData = data.filter((i:item) => i.albumId===Number(filter));
    const newMaxPage = Math.ceil(filteredData.length/imgPerPage);
    setPage(Math.max(1, Math.min(newMaxPage, page)));
    setMaxPage(newMaxPage);
    setCurrentPageData(filteredData.slice((page-1)*imgPerPage, page*imgPerPage));
  }, [page, data, filter]);


  return (
    <div>
      <Container maxWidth="md">
        <div className="gallery">
          <div className="controller">
            <Autocomplete
              onChange={(event: React.SyntheticEvent, value: string | null, reason: AutocompleteChangeReason,
                         details?: AutocompleteChangeDetails<string>) => setFilter(value)}
              disablePortal
              id="combo-box-demo"
              options={albumIds}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Album id" />}
            />
            <Pagination 
              onChange={(event: React.ChangeEvent<unknown>, page: number) => setPage(page)} count={maxPage} defaultPage={1} page={page} siblingCount={0}
            />  
          </div>

          
          <div className="content"> 
            { currentPageData.map( (item: item) =>
              <Card className="card" key={item.id}>
                <IconButton className="closeButton" aria-label="delete" 
                  onClick={() => setData(data.filter(i => item.id!==i.id))}>
                  <DeleteIcon/>
                </IconButton>
                <CardMedia
                  component="img"
                  height="150"
                  image={item.thumbnailUrl}
                  alt={item.title}
                  onClick={() => {
                    setModalUrl(item.url);
                    setModalOpen(true);
                  }}
                />
              </Card>
            )}
          </div>
          
        </div>
      </Container>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Box className='modalBox'>
          <img src={modalUrl} alt=''/>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
