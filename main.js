const path = require("path");
// const workerthreads
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler.js");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

const runScript = async () => {
    try {
      await IOhandler.unzip(zipFilePath, pathUnzipped);
      const pngFiles = await IOhandler.readDir(pathUnzipped);
      for (const file of pngFiles) {
        await IOhandler.grayScale(
          file,
          path.join(pathProcessed, path.basename(file))
        );
      }
    } catch (error) {
      console.log("Error occurred:", error);
    }
  };
  

runScript();




















