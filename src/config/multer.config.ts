import multer from 'multer';
import { resolve, extname } from 'path';
import { randomBytes } from 'crypto';

const storage = multer.diskStorage({
  destination: resolve(__dirname, '..', '..', 'tmp'),
  filename: (req, file, cb) => {
    const filename = `${randomBytes(8).toString(
      'hex',
    )}-${new Date().toISOString()}.${extname(file.originalname)}`;
    return cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;
