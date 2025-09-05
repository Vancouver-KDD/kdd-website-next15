import {RowsPhotoAlbum} from 'react-photo-album'
import type {Photo} from 'react-photo-album'
import 'react-photo-album/rows.css'

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48]

const photos: Photo[] = [
  {
    key: '1',
    src: 'https://picsum.photos/200/300',
    width: 200,
    height: 300,
  },
  {
    key: '2',
    src: 'https://picsum.photos/200/300',
    width: 200,
    height: 300,
  },
  {
    key: '3',
    src: 'https://picsum.photos/200/300',
    width: 200,
    height: 300,
  },
]

export default function Photos() {
  return <RowsPhotoAlbum photos={photos} breakpoints={breakpoints} />
}
