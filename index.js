const fs = require('fs');
const csv = require('csv-parser');

// Delete existing files if they exist
const deleteFile = (filename) => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
    console.log(`${filename} deleted`);
  }
};

// Function to filter and write data to respective files
const filterData = (inputFile, outputCanada, outputUSA) => {
  const canadaStream = fs.createWriteStream(outputCanada, { flags: 'a' });
  const usaStream = fs.createWriteStream(outputUSA, { flags: 'a' });

  canadaStream.write('country,year,population\n');
  usaStream.write('country,year,population\n');

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      if (row.country.toLowerCase() === 'canada') {
        canadaStream.write(`${row.country},${row.year},${row.population}\n`);
      } else if (row.country.toLowerCase() === 'united states') {
        usaStream.write(`${row.country},${row.year},${row.population}\n`);
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      canadaStream.end();
      usaStream.end();
    });
};

// Define file paths
const inputFile = './input_countries.csv';
const canadaFile = './canada.txt';
const usaFile = './usa.txt';

// Delete existing files and process the input
deleteFile(canadaFile);
deleteFile(usaFile);
filterData(inputFile, canadaFile, usaFile);
