const colors = require('colorthief');

exports.isSolidColor = (req, res) => {
    colors.getPalette(req.body.img_url, 5).then(palette => {
        const isSolidColor = palette.every(col => col.every(v => v < 20));
        res.json({solid: isSolidColor});
    }).catch(err => res.json({error: 'Could not process request'}));
}
