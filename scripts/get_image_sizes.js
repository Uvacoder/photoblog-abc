const path = require('path');
const fs = require('fs');
const image_size = require('image-size');
const { stdout } = require('process');

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

const getDimensions = (dir, files) => Object.fromEntries(
    files.map(file => [file, image_size(path.resolve(dir, file))])
);


const photoDirectory = path.resolve(__dirname, '../site/photos/');
const photos = listFilesInDirectory(photoDirectory, photoDirectory);
const photoInfo = getDimensions(photoDirectory, photos);

stdout.write(JSON.stringify(photoInfo));
