const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');

/**
 * Strip a leading date in Y-m-d format from a string.
 * @param {string} fileSlug     The string to strip the date from.
 */
const stripDate = fileSlug => fileSlug.replace(/^\d{4}-\d{2}-\d{2}-?/, '');

/**
 * Get a list of headlines of the specified level in a piece of HTML.
 *
 * @param {string} html         The HTML to look for headings in.
 * @param {int} headlineLevel   The headline level to look for(between 1 - 6).
 */
const findSections = (html, headlineLevel = 2) => {
    const dom = new JSDOM(html);
    return Array.from(dom.window.document.querySelectorAll(`h${headlineLevel}`)).map(heading => {
        const textOnly = Array.from(heading.childNodes).filter(node => node.nodeName === '#text').map(node => node.textContent).join(' ');
        return {
            textContent: heading.textContent,
            textOnly,
            innerHTML: heading.innerHTML,
            id: heading.id,
        }
    });
}

/**
 * Convert a title to a slug to be used as an URL path component.
 * @param {string} title    The title to convert.
 */
const readableSlug = title => encodeURIComponent(title.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^\w-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, ''));

/**
 * Get the SVG source of the specified fontawesome icon, including the specified
 * classes and alt text.
 *
 * @param {string} icon     The icon to get, in the format `style/icon`, e.g. `solid/cat`.
 * @param {array} classes   Classes to add to this icon.
 * @param {string} alt      Alt-Text for the image.
 */
const fontawesome = (icon, classes = ['fontawesome'], alt = '') => {
    const attributes = `class="${classes.join(' ')}" alt="${alt}"`;
    const svg = fs.readFileSync(
        path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free/svgs', `${icon}.svg`),
        'utf8'
    );
    return svg.replace(/^\<svg/, `<svg ${attributes}`);
}

/**
 * Get an image from the photos folder in the specified width.
 * @param {string|object} image     The image (relative path or object with relative path as `name` property).
 * @param {int} width               The width to get the image in.
 */
const imageWidth = (image, width) => `${image}?nf_resize=fit&w=${width}`;

/**
 * Get a `srcset` attribute string for the specified image.
 * @param {string} src      The image path (relative to the photos directory).
 * @param {int[]} widths    Array of integers (widths).
 */
const widthsToSrcset = (src, widths) => widths.reduce((carry, width) => {
    return `${carry}${carry ? ', ' : ''}${imageWidth(src, width)} ${width}w`;
}, '')

module.exports = {
    stripDate,
    findSections,
    readableSlug,
    fontawesome,
    imageWidth,
    widthsToSrcset,
}
