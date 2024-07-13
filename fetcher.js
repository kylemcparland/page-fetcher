const needle = require("needle");
const fs = require("fs");
const url = process.argv[2];
const localFilePath = process.argv[3];
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

needle.get(url, (error, response, body) => {
  // declare function to save file:
  const saveFile = (content) => {
    fs.writeFile(localFilePath, content, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Downloaded and saved ${response.bytes} bytes to ${localFilePath}`);
        return;
      }
    });
  };

  // handle errors & invalid url:
  if (error) {
    if (error.errno === "ENOTFOUND") {
      console.log("URL is invalid. Aborting...");
    } else {
      console.log("error:", error);
    }
    rl.close();
    return;
  }

  // confirm if file already exists:
  if (fs.existsSync(`./${localFilePath}`)) {
    // prompt user to confirm overwrite:
    rl.question("File already exists. Do you wish to overwrite? (respond: 'y' or 'n'): ", (answer) => {
      if (answer !== "y") {
        rl.close();
        console.log("File save aborted.");
      } else {
        rl.close();
        saveFile(body);
      }
    });
  } else {
    rl.close();
    saveFile(body);
  }
});