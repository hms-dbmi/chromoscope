import cnv from './cnv';
import gain from './gain';
import loh from './loh';
import sv from './sv';
import mutation from './mutation';
import indel from './indel';
import boundary from './boundary';

export type TrackMode = 'small' | 'top' | 'mid';

export default {
    cnv,
    gain,
    loh,
    sv,
    mutation,
    indel,
    boundary
};
