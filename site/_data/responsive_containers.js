/**
 * @file
 * This file contains the layout breakpoints and corresponding container widths
 * (excluding padding) for each layout variant. This constitutes the maximum
 * content width and is used to create the `sizes` attribute for responsive images.
 */

module.exports = {
    breakpoints: {
        lg: "82rem",
        md: "65rem",
        sm: "50rem",
        xs: 0,
    },
    base: {
        lg: "44rem",
        md: "36rem",
        sm: "min(100vw - 4rem, 36rem)",
        xs: "min(100vw - 2rem, 38rem)",
    },
    wide: {
        lg: "59rem",
        md: "41rem",
        sm: "min(100vw - 4rem, 46rem)",
        xs: "min(100vw - 2rem, 48rem)",
    },
    full: {
        lg: "calc(100vw - 36rem)",
        md: "calc(100vw - 30rem)",
        sm: "calc(96vw - 4rem)",
        xs: "calc(100vw - 2rem)",
    }
}
