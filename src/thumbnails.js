/* WIP */
// const fs = require('fs');
// const samples = require('./data/samples');
// const getSmallOverviewSpec = require('./overview-spec');

// const generateSampleThumbnails = () => {
//     const specs = samples.map(d =>
//         getSmallOverviewSpec({
//             cnvUrl: d.cnv,
//             svUrl: d.sv,
//             width: 600,
//             title: d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1),
//             subtitle: '' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : ''),
//             cnFields: d.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
//         })
//     );
//     return specs;
// };

// try {
//     const specs = JSON.stringify(JSON.stringify(generateSampleThumbnails()).replace('\\', '\\\\'));
//     specs.forEach((spec, i) => {
//         fs.writeFile(`./script/overview_spec_${i}.json`, spec);
//     });
// } catch (err) {
//     console.error(err);
// }
