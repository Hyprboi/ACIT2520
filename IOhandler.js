/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const { pipeline } = require("stream");
const decompress = require("decompress")


const unzipper = require("unzipper")
const fs = require("fs")
// const PNG = require("pngjs").PNG

const stream = require("stream")
const { Transform } = require("stream")
const { error, dir } = require("console")
const { type } = require("os")
const { existsSync, mkdirSync } = require("fs")
const path = require("path");
const { fileURLToPath } = require("url");
const { PNG } = require("pngjs");


/**
 
Description: decompress file from given pathIn, write to given pathOut*
@param {string} pathIn
@param {string} pathOut
@return {promise}
*/

const unzip = async (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Parse())
      .on("entry", entry => {
        const fileName = entry.path;
        const type = entry.type; // 'Directory' or 'File'
        if (type == "File" && !fileName.includes("MACOS")) {
          fs.promises
            .mkdir(pathOut, { recursive: true })
            .then(() => {
              entry.pipe(fs.createWriteStream((path.join(pathOut, fileName))));
            })
            .catch((err) => {
              console.log("Error while creating directory:", err);
              reject(err);
            });
        } else {
          entry.autodrain();
        }
      })
      .on("error", err => {
        console.log("Error while unzipping:", err);
        reject(err);
      })
      .on("close", () => {
        console.log("Extraction complete");
        resolve();
      });
  });
};

 /**
*  Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = async (dir) => {
  try {
    const files = await fs.promises.readdir(path.resolve(__dirname, dir));
    const filteredFiles = files.filter((file) => file.endsWith(".png"));
    const filePaths = filteredFiles.map((file) =>
      path.resolve(__dirname, dir, file)
    );
    return filePaths;
  } catch (error) {
    console.error("Error while reading directory:", error);
    reject(error);
  }
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = async (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.promises
      .mkdir(path.dirname(pathOut), { recursive: true })
      .catch((error) => {
        console.error("Error while creating directory:", error);
        reject(error);
      });
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const avg = Math.round(
              (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3
            );
            this.data[idx] = avg;
            this.data[idx + 1] = avg;
            this.data[idx + 2] = avg;
          }
        }

        this.pack()
          .pipe(fs.createWriteStream(pathOut))
          .on("finish", () => {
            console.log(`Grayscale conversion completed for ${pathIn}`);
            resolve();
          })
          .on("error", (error) => {
            console.error(
              `Error writing grayscale image for ${pathIn}: ${error}`
            );
            reject(error);
          });
      })
      .on("error", (error) => {
        console.error(`Error parsing PNG file ${pathIn}: ${error}`);
        reject(error);
      });
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};

// (1) In ioHandler.js, create a function to unzip the zip file using the "unzipper" library. 
// (2) Show the message: "Extraction operation complete", but only after all files are unzipped





