const needle = require("needle");
const fs = require('fs');
const url = process.argv[2];
const localFilePath = process.argv[3];
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

needle.get(url, (error, response, body) => {
  // handle errors & invalid url:
  if (error) {
    if (error.errno === "ENOTFOUND") {
      console.log("URL is invalid. Aborting...");
      rl.close();
      return;
    } else {
      console.log("error:", error);
    }
  }

  // handle invalid file path:
  fs.readFileSync(localFilePath);

  // confirm if file already exists:
  if (fs.existsSync(`./${localFilePath}`)) {
    // prompt user to confirm overwrite:
    rl.question("File already exists. Do you wish to overwrite? (respond: 'y' or 'n'): ", (answer) => {
      if (answer === "y") {
        rl.close();
        fs.writeFile(localFilePath, body, err => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Downloaded and saved ${response.bytes} bytes to ${localFilePath}`);
          }
        });
      } else if (answer === "n") {
        rl.close();
        console.log("File save aborted.");
      } else {
        rl.close();
        console.log("Invalid command. Aborting...");
      }
    });
  }

});