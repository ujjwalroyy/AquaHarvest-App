import multer from 'multer';

export const getDataUri = (file) => {
    const buffer = file.buffer; // Buffer from memory storage
    const dataUri = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    return { content: dataUri };
  };

  const storage = multer.memoryStorage(); // or any other storage option
export const upload = multer({ storage }).single('image');