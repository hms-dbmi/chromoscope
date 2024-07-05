import driver from './driver';
import cnv from './cnv';
import coverage from './coverage';
import gain from './gain';
import loh from './loh';
import sv from './sv';
import mutation from './mutation';
import indel from './indel';
import boundary from './boundary';
import baf from './baf';
import biAlleleFrequency from './Bi_allel_example';

export type TrackMode = 'small' | 'top' | 'mid';

export default {
    driver,
    cnv,
    coverage,
    gain,
    loh,
    sv,
    mutation,
    indel,
    boundary,
    baf,
    biAlleleFrequency
};
