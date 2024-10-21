import multer from 'multer';

export const getDataUri = (file) => {
    const buffer = file.buffer; 
    const dataUri = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    return { content: dataUri };
  };

  const storage = multer.memoryStorage(); 
export const upload = multer({ storage }).single('image');