
const markdownIt = require('markdown-it');
const utils = require('./src/utils');
const path = require('path');

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
        // permalinkSymbol: '→',
        // permalinkSymbol: '👈',
        permalinkSymbol: '#',
    });
    eleventyConfig.setLibrary('md', markdownLib);

    const imageWidth = (image, width) => `${image}?nf_resize=fit&w=${width}`;
    eleventyConfig.addFilter('imageWidth', imageWidth);
    eleventyConfig.addFilter('widthsToSrcset', (src, widths) => widths.reduce((carry, width) => {
        return `${carry}${carry ? ', ' : ''}${imageWidth(src, width)} ${width}w`;
    }, ''));

    eleventyConfig.addFilter('firstNItems', (arr, n = 1) => arr.slice(0, n));
    eleventyConfig.addFilter('implodeTruthy', (arr, glue = ', ') => arr.filter(item => !!item).join(glue));
    eleventyConfig.addFilter('is_string', s => typeof s === 'string');
    eleventyConfig.addFilter('is_object', s => typeof s === 'object');
    eleventyConfig.addFilter('stripDate', utils.stripDate);
    eleventyConfig.addFilter('findSections', utils.findSections);
    eleventyConfig.addShortcode('fontawesome', utils.fontawesome);

    eleventyConfig.addFilter('md', text => markdownLib.render(text));
    eleventyConfig.addFilter('md_inline', text => markdownLib.renderInline(text));

    eleventyConfig.addFilter('date', date => (new Date(date)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }));
    eleventyConfig.addFilter('date_iso', date => (new Date(date).toISOString().split('T')[0]));

    eleventyConfig.addFilter('log', v => console.log(v));

    // syntax highlighting
    // const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
    // eleventyConfig.addPlugin(syntaxHighlight, {
    //     templateFormats: ["md"],
    //     init: ({Prism}) => {},
    // });

    eleventyConfig.addPassthroughCopy({
        'site/_redirects': '_redirects',
        'site/_headers': '_headers',
        'site/photos': 'photos',
    });

    const photosBySubject = collection => collection.getFilteredByTag('subject').sort((a, b) => {
        return a.data.sort - b.data.sort;
    });
    const photosBySubjectWithFavourites = collection => ([
        ...photosBySubject(collection),
        ...(collection.getFilteredByTag('favourites'))
    ]);
    const photosByProject = collection => collection.getFilteredByTag('project').sort((a, b) => {
        return b.date - a.date
    });

    eleventyConfig.addWatchTarget('src/');

    eleventyConfig.addCollection('subjects', c => photosBySubject(c));
    eleventyConfig.addCollection('subjects_favourites', c => photosBySubjectWithFavourites(c));
    eleventyConfig.addCollection('projects', c => photosByProject(c));

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
