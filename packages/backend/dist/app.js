"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const app = express_1.default();
const dir = path_1.resolve(__dirname, '../tmp/');
console.log(dir);
// SET STORAGE
var storage = multer_1.default.diskStorage({
    destination: dir,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer_1.default({ storage: storage });
// const upload = multer({ dest: dir }); // multer configuration
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.send({
                status: false,
                message: 'No file uploaded',
            });
        }
        else {
            const { tempUnit } = req.body || {};
            const features = [];
            const allData = JSON.parse(fs_1.default.readFileSync(`${dir}/${file.originalname}`, 'utf8'));
            console.log(allData);
            allData.forEach((data) => {
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
            console.log(features);
            console.log(typeof features);
            res.send({
                type: 'FeatureCollection',
                features,
            });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
exports.default = app;
