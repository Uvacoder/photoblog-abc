const containers = require('./responsive_containers');

const buildSizesQuery = sizes => Object.entries(sizes).reduce((carry, entry) => {
    const [breakpoint, width] = entry;
    const breakpointWidth = containers.breakpoints[breakpoint];
    const query = breakpointWidth ? `(min-width: ${breakpointWidth}) ` : '';
    return `${carry}${carry ? ', ' : ''}${query}${width}`;
}, '');

module.exports = {
    photoList: {
        fullwidth: buildSizesQuery(containers.fullwidth),
        halfwidth: buildSizesQuery(containers.halfwidth),
        srcset: [360, 480, 540, 720, 960, 1080, 1200, 1600, 2400]
    },
}
