const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const train = require("@zappar/imagetraining");
const fs = require("fs/promises");
const app = express();

const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(pino);

app.get("/check", function (req, res) {
  res.send("working");
  //    res.sendFile("logo.png", { root: "public" });
  // res.download('./public/logo.png')
});

// configuring the DiskStorage engine.
const storage = multer.diskStorage({
  destination: "public/",
  filename: function (req, file, cb) {
    cb(null, file.originalname+'.png');
  },
});
const upload = multer({ storage: storage });

//POST method route for uploading file
app.post("/train_target", upload.single("file"), function (req, res) {
  res.setHeader("Content-Type", "application/json");
  //send file to zappar training
 perform(req.file.path, req.file.filename, res);
});

async function perform(path, name, res) {
  var filename = name.match(/^.*?([^\\/.]*)[^\\/]*$/)[1];

  let png = await fs.readFile(path);
  let target = await train.train(png);
  await fs.writeFile("public/" + filename + ".zpt", target);

  fs.unlink(path);
  uploadAws(res)
  res.sendFile(filename+'.zpt',{root: "public"});
  // res.send({
      // path:'http://localhost:4001/public/'+filename+".zpt"
  //     path: 'https://microexp-image-training.s3.us-west-2.amazonaws.com/' + filename + ".zpt"
  // })
}

// var s3 = new aws.s3({
//   accessKeyId: "AKIA4HMYZ2LJ45OU2MU5",
//   secretAccessKey: "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",
//   Bucket: "microexp-image-training"
// })

// var uploadAws = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket:"",
//     metadata: function(req, file, cb) {
//       cb(null, {fieldName: file.fieldName})
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })


const port = process.env.PORT || 4001;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});
