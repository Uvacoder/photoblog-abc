
const markdownIt = require('markdown-it');
const utils = require('./src/utils');

module.exports = eleventyConfig => {

    // custom markdown library with automatic anchors for h2 headings
    const markdownLib = markdownIt({
        html: true,
        typographer: true,
    }).use(require('markdown-it-anchor'), {
        level: [2],
        slugify: utils.readableSlug,
        permalink: true,
        permalinkClass: 'section-anchor',
        permalinkSymbol: '#',
    });
    eleventyConfig.setLibrary('md', markdownLib);

    // image manipulation
    eleventyConfig.addFilter('imageWidth', utils.imageWidth);
    eleventyConfig.addFilter('widthsToSrcset', utils.widthsToSrcset);
    // utility methods
    eleventyConfig.addFilter('firstNItems', (arr, n = 1) => arr.slice(0, n));
    eleventyConfig.addFilter('implodeTruthy', (arr, glue = ', ') => arr.filter(item => !!item).join(glue));
    eleventyConfig.addFilter('is_string', s => typeof s === 'string');
    eleventyConfig.addFilter('is_object', s => typeof s === 'object');
    eleventyConfig.addFilter('stripDate', utils.stripDate);
    eleventyConfig.addFilter('findSections', utils.findSections);
    // markdown render filter
    eleventyConfig.addFilter('md', text => markdownLib.render(text));
    eleventyConfig.addFilter('md_inline', text => markdownLib.renderInline(text));
    // date functions
    eleventyConfig.addFilter('date', date => (new Date(date)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }));
    eleventyConfig.addFilter('date_iso', date => (new Date(date).toISOString().split('T')[0]));
    // debug utility
    eleventyConfig.addFilter('log', v => console.log(v));

    // shortcode to get fontawesome icons
    eleventyConfig.addShortcode('fontawesome', utils.fontawesome);

    // get a sorted list of subject collections
    const photosBySubject = collection => collection.getFilteredByTag('subject').sort((a, b) => {
        return a.data.sort - b.data.sort;
    });
    // get a sorted list of subject collections, including the "favourites" page
    const photosBySubjectWithFavourites = collection => ([
        ...photosBySubject(collection),
        ...(collection.getFilteredByTag('favourites'))
    ]);
    // get a sorted list of projects
    const photosByProject = collection => collection.getFilteredByTag('project').sort((a, b) => {
        return b.date - a.date
    });

    // add subjects & project collections
    eleventyConfig.addCollection('subjects', c => photosBySubject(c));
    eleventyConfig.addCollection('subjects_favourites', c => photosBySubjectWithFavourites(c));
    eleventyConfig.addCollection('projects', c => photosByProject(c));

    // add the post tree for the navigation
    eleventyConfig.addCollection('postTree', collection => {
        return [
            {
                title: 'General',
                posts: [
                    ...collection.getFilteredByTag('homepage'),
                    ...collection.getFilteredByTag('blog'),
                    ...collection.getFilteredByTag('favourites'),
                ],
            },
            {
                title: 'Photos by subject',
                posts: photosBySubject(collection),
            },
            {
                title: 'Photos by project',
                posts: photosByProject(collection),
            }
        ];
    });

    // configure eleventy file copy
    eleventyConfig.addPassthroughCopy({
        'site/assets': 'assets',
        'site/root-assets/*': '.',
        'site/_redirects': '_redirects',
        'site/_headers': '_headers',
        'site/photos': 'photos',
    });

    // watch css / js directories
    eleventyConfig.addWatchTarget('src/');

    return {
        templateFormats: ['html', 'md', 'njk', '11ty.js'],
        markdownTemplateEngine: 'njk',
        pathPrefix: '/',
        dir: {
            input: 'site/',
            output: 'dist/',
            includes: "_includes",
            layouts: "_includes/_layouts",
            data: "_data",
        },
    }
}
