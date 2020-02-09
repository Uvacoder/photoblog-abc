
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
                posts: collection.getFilteredByTag('category').sort((a, b) => {
                    return a.data.sort - b.data.sort;
                }),
            },
            {
                title: 'Photos by project',
                posts: collection.getFilteredByTag('project').sort((a, b) => {
                    return a.date - b.date
                }),
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
