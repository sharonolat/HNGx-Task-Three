import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSwappingStrategy,
} from '@dnd-kit/sortable';
import SortableImageItem from '../components/SortableImageItem';
import '../styles/image-gallery.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ShowToastMessage from '../components/ShowToastMessage';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../assets/search.svg';

const ImageGallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor));

  const tags = [
    'nature',
    'water',
    'mountain',
    'snow',
    'forest',
    'sky',
    'clouds',
    'sunset',
    'sunrise',
    'beach',
  ];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((images) => {
        const oldIndex = images.findIndex((item) => item.id === active.id);
        const newIndex = images.findIndex((item) => item.id === over.id);

        return arrayMove(images, oldIndex, newIndex);
      });
    }
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        'https://api.unsplash.com/photos/random?count=20',
        {
          headers: {
            Authorization: `Client-ID ${
              import.meta.env.VITE_UNSPLASH_ACCESS_KEY
            }`,
          },
        }
      );

      const images = res.data.map((image) => image.urls.regular);
      const itemsArr = images.map((url, index) => {
        return {
          id: index + 1,
          url,
          tag: tags[Math.floor(Math.random() * tags.length)],
        };
      });

      const parsedImages = JSON.stringify(itemsArr);

      // Set the 'images' cookie with the new data
      sessionStorage.setItem('images', parsedImages);

      setImages(itemsArr);
      setIsLoading(false);
    } catch (err) {
      if (sessionStorage.getItem('images')) {
        setImages(JSON.parse(sessionStorage.getItem('images')));
        setIsLoading(false);
        return;
      }
      ShowToastMessage(
        'An error occurred. Please refresh or try again',
        'error'
      );
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredImages = JSON.parse(Cookies.get('images')).filter((image) =>
      image.tag.toLowerCase().includes(query)
    );
    setImages(filteredImages);
  };

  useEffect(() => {
    if (!Cookies.get('token')) {
      ShowToastMessage('Please login to continue', 'error');
      navigate('/login');
      return;
    }
    fetchImages();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className='logout-container'>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className='header-container'>
        <h1>Image Gallery</h1>
        <p>Drag and drop images to reposition</p>
      </div>

      <div className='search-container'>
        <div className='search'>
          <input
            type='text'
            placeholder='Search images by tag'
            onChange={handleSearch}
          />
          <img src={searchIcon} alt='search-icon' />
        </div>
      </div>

      <div className='image-gallery'>
        {isLoading ? (
          <Spinner message='Loading images, Please wait...' />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSwappingStrategy}>
              {images.map((image, index) => (
                <SortableImageItem
                  key={index}
                  id={image.id}
                  url={image.url}
                  tag={image.tag}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
};

export default ImageGallery;
