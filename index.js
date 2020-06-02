const colors = require('colorthief');

exports.isSolidColor = (req, res) => {
    colors.getColor(req.body.img_url).then(dominantColor => {
        const isSolidColor = dominantColor.every(v => v < 50);
        res.json({solid: isSolidColor});
    }).catch(() => res.json({error: 'Could not process request'}));
}
