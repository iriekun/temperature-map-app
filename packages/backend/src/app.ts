import express from 'express';
import cors from 'cors';
import fs from 'fs';
import helmet from 'helmet';
import multer from 'multer';
import { resolve } from 'path';

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  city: string;
  icon: string;
  temperature: string;
  tempUnit: string;
}

interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Data {
  city: string;
  lat: string;
  lng: string;
  temp: string;
}

const app: express.Application = express();
const dir = resolve(__dirname, '../tmp/');

// Set multer storage
const storage = multer.diskStorage({
  destination: dir,
  // eslint-disable-next-line no-restricted-syntax
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  '/upload',
  upload.single('file'),
  async (req: express.Request, res: express.Response) => {
    try {
      const { file } = req;
      if (!file) {
        res.status(400).send({
          message: 'No file uploaded',
        });
      } else {
        const { tempUnit } = req.body || {};
        const features: Feature[] = [];
        const allData = JSON.parse(
          fs.readFileSync(`${dir}/${file.originalname}`, 'utf8')
        );
        allData.forEach((data: Data) => {
          const params = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [Number(data.lng), Number(data.lat)],
            },
            properties: {
              city: data.city,
              icon: 'circle',
              temperature: data.temp,
              tempUnit,
            },
          };
          features.push(params);
        });
        res.send({
          type: 'FeatureCollection',
          features,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

export default app;
