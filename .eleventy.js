
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
        // permalinkSymbol: '→',
        // permalinkSymbol: '👈',
        permalinkSymbol: '#',
    });
    eleventyConfig.setLibrary('md', markdownLib);

    eleventyConfig.addFilter('firstNItems', (arr, n = 1) => arr.slice(0, n));
    eleventyConfig.addFilter('implodeTruthy', (arr, glue = ', ') => arr.filter(item => !!item).join(glue));
    eleventyConfig.addFilter('is_string', s => typeof s === 'string');
    eleventyConfig.addFilter('is_object', s => typeof s === 'object');
    eleventyConfig.addFilter('stripDate', utils.stripDate);
    eleventyConfig.addFilter('findSections', utils.findSections);
    eleventyConfig.addShortcode('fontawesome', utils.fontawesome);

    // syntax highlighting
    // const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
    // eleventyConfig.addPlugin(syntaxHighlight, {
    //     templateFormats: ["md"],
    //     init: ({Prism}) => {},
    // });

    eleventyConfig.addPassthroughCopy({
        'site/_js': `js`,
        'site/_headers': '_headers',
        'site/photos': 'photos',
    });

    const photosBySubject = collection => collection.getFilteredByTag('category').sort((a, b) => {
        return a.data.sort - b.data.sort;
    });

    const photosByProject = collection => collection.getFilteredByTag('project').sort((a, b) => {
        return b.date - a.date
    });

    eleventyConfig.addCollection('subjects', c => photosBySubject(c));
    eleventyConfig.addCollection('projects', c => photosByProject(c));

    eleventyConfig.addCollection('postTree', collection => {
        return [
            {
                title: 'General',
                posts: [
                    ...collection.getFilteredByTag('homepage'),
                    ...collection.getFilteredByTag('blog'),
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
