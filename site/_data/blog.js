const edinburgh = require('./photos/edinburgh.json');

module.exports = [
    // posted; time this photo was added
    // image; the image to include
    // caption; caption for this figure
    // link: optional link for this update (text + url)
    {
        image: {
            name: "blue_dragonfly_02.jpg",
            alt: "Close-up of a blue damselfly on a green leaf.",
        },
        caption: "A blue Damselfly that posed for me on my way to a shooting.",
        date: '2018-02-01 (PLACEHOLDER)'
    },
    {
        image: {
            name: "sheep_bw_03.jpg",
            alt: "A sheep in black-and-white looking at the camera, sheared around the head."
        },
        caption: "A sheep",
        link: {
            text: "Full set of black-and-white sheep",
            url: "/black-and-white-sheep",
        }
    },
    {
        image: edinburgh[0],
        link: {
            text: "All photos from Edinburgh",
            url: "/edinburgh",
        }
    },
];
