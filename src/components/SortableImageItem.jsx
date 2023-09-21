import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../styles/image-box.scss';

export function SortableImageItem({ id, url, tag }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: null,
  };



  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={' image-box'}
    >
      <img src={url} alt={`gallery-pic-${id}`} />
      <p className='tag'>{tag}</p>
    </button>
  );
}

export default SortableImageItem;
