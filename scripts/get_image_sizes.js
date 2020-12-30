const path = require('path');
const fs = require('fs');
const image_size = require('image-size');

/**
 * Get a flat list of all files in a directory. Searches subdirectories recursively.
 *
 * @param string dir        The directory to look in.
 * @param string basePath   The base directory, resulting filenames will be relative to that directory.
 */
const listFilesInDirectory = (dir, basePath) => fs.readdirSync(dir, { withFileTypes: true })
    .map(dirent => dirent.isDirectory()
            ? listFilesInDirectory(path.join(dir, dirent.name), basePath)
            : path.relative(basePath, path.join(dir, dirent.name))
        )
    .flat();

/**
 * Get a map of image dimensions for the passed files.
 * @param string dir    Base directory (file names should be relative to it).
 * @param array files   Array of filenames.
 */
const getDimensions = (dir, files) => Object.fromEntries(
    files.map(file => [file, image_size(path.resolve(dir, file))])
);

// directory with photos and target file
const photoDirectory = path.resolve(__dirname, '../site/photos/');
const targetFile = path.resolve(__dirname, '../site/_data/image_sizes.json');

// get list of files and their dimensions
const photos = listFilesInDirectory(photoDirectory, photoDirectory);
const photoInfo = getDimensions(photoDirectory, photos);
const encodedInfo = JSON.stringify(photoInfo);

// get the current file contents
const currentContents = fs.readFileSync(targetFile, 'utf8');

// overwrite the file with the new information
fs.writeFileSync(targetFile, encodedInfo, { encoding: 'utf8' });

// if instructed, exit with error code if the file has changed (for usage in pre-commit hook)
const throwOnDiff = process.argv.includes('--throw-on-diff');
if (throwOnDiff && (currentContents !== encodedInfo)) {
    process.exit(1);
}

process.exit(0);
