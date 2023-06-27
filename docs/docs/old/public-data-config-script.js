// Script to generate the list of public data configs to be added in *.md
let o = '';
temp1
    .sort((a, b) => -a['no.samples'] + b['no.samples'])
    .map(d => {
        const [tissue, cancer] = d['histology_abbreviation'].split('-');
        const size = d['no.samples'];
        const link = d['config.link'];
        return {
            tissue,
            cancer,
            size,
            link
        };
    })
    .forEach(d => {
        o += `1. [${d.cancer} (${d.tissue})](https://chromoscope.bio/?external=${d.link}) (${d.size} samples)\n`;
    });
