import cnv from './cnv';
import gain from './gain';
import loh from './loh';
import sv from './sv';
import vcf from './vcf';
import boundary from './boundary';

export type TrackMode = 'small' | 'top' | 'mid';

export default {
    cnv,
    gain,
    loh,
    sv,
    vcf,
    boundary
};
