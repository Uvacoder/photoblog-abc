const containers = require('./responsive_containers');

const buildSizesQuery = sizes => Object.entries(sizes).reduce((carry, entry) => {
    const [breakpoint, width] = entry;
    const breakpointWidth = (breakpoint in containers.breakpoints) ? containers.breakpoints[breakpoint] : breakpoint;
    const query = breakpointWidth ? `(min-width: ${breakpointWidth}) ` : '';
    return `${carry}${carry ? ', ' : ''}${query}${width}`;
}, '');

module.exports = {
    oneColumn: {
        base: {
            sizes: buildSizesQuery(containers.base),
            srcset: [360, 480, 576, 640, 704, 864, 1056, 1140, 1220, 1420],
        },
        wide: {
            sizes: buildSizesQuery(containers.wide),
            srcset: [360, 480, 540, 656, 736, 1000, 1120, 1480, 1888],
        },
        full: {
            sizes: buildSizesQuery(containers.full),
            srcset: [360, 480, 540, 720, 960, 1080, 1200, 1600, 2000, 2400],
        },
    },
    twoColumns: {
        base: {
            sizes: buildSizesQuery({
                lg: `calc((${containers.base.lg} - 2rem) / 2)`,
                md: `calc((${containers.base.md} - 2rem) / 2)`,
                sm: `calc((${containers.base.sm} - 2rem) / 2)`,
                xs: containers.base.xs,
            }),
            srcset: [320, 480, 576, 620, 840, 960, 1140, 1200, 1400],
        },
        wide: {
            sizes: buildSizesQuery({
                lg: `calc((${containers.wide.lg} - 2rem) / 2)`,
                md: `calc((${containers.wide.md} - 2rem) / 2)`,
                sm: `calc((${containers.wide.sm} - 2rem) / 2)`,
                xs: containers.wide.xs,
            }),
            srcset: [320, 480, 576, 640, 840, 912, 1080, 1200, 1600],
        },
        full: {
            sizes: buildSizesQuery({
                lg: `calc((${containers.full.lg} - 2rem) / 2)`,
                md: `calc((${containers.full.md} - 2rem) / 2)`,
                sm: `calc((${containers.full.sm} - 2rem) / 2)`,
                xs: containers.full.xs,
            }),
            srcset: [320, 480, 576, 620, 840, 960, 1140, 1400],
        },
    },
    threeColumns: {
        base: {
            sizes: buildSizesQuery({
                lg: `calc((${containers.base.lg} - 4rem) / 3)`,
                md: `calc((${containers.base.md} - 2rem) / 2)`,
                sm: `calc((${containers.base.sm} - 2rem) / 2)`,
                xs: containers.base.xs,
            }),
            srcset: [280, 320, 480, 576, 620, 840, 960],
        },
        wide: {
            sizes: buildSizesQuery({
                lg: `calc((${containers.wide.lg} - 4rem) / 3)`,
                md: `calc((${containers.wide.md} - 2rem) / 2)`,
                sm: `calc((${containers.wide.sm} - 2rem) / 2)`,
                xs: containers.wide.xs,
            }),
            srcset: [320, 480, 576, 620, 840, 960],
        },
        full: {
            sizes: buildSizesQuery({
                lg: `calc((${containers.full.lg} - 4rem) / 3)`,
                md: `calc((${containers.full.md} - 2rem) / 2)`,
                sm: `calc((${containers.full.sm} - 2rem) / 2)`,
                xs: containers.full.xs,
            }),
            srcset: [320, 480, 576, 620, 840, 960, 1140, 1400],
        },
    },
}
