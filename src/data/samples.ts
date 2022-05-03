import { Assembly } from 'gosling.js/dist/src/core/gosling.schema';
import { THUMBNAILS } from './thumbnails';

type SampleType = {
    id: string; // "aliquot ID"
    cancer: string; // cancer type
    assembly: Assembly; // hg19 or 38
    sv: string; // URL of bedpe
    cnv: string; // URL of txt
    bam?: string; // URL of bam
    bai?: string; // URL of bai
    cnFields?: [string, string, string];
    thumbnail?: string;
};

const samples: SampleType[] = [
    ...Array.from({ length: 92 }, (v, i) => i).map(
        (
            i // 92
        ) =>
            ({
                id: `sample_${i + 1}`,
                cancer: 'Breast',
                assembly: 'hg19',
                sv: `https://genomebrowserdata.s3.amazonaws.com/sv/sample_${i + 1}.bedpe`,
                cnv: `https://genomebrowserdata.s3.amazonaws.com/cnv/sample_${i + 1}.tsv`,
                cnFields: ['cn', 'cn1', 'cn2'],
                thumbnail: THUMBNAILS[i]
            } as SampleType)
    ),
    {
        id: '7a921087-8e62-4a93-a757-fd8cdbe1eb8f',
        cancer: 'ovarian',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt',
        thumbnail: THUMBNAILS[92]
    },
    {
        id: '84ca6ab0-9edc-4636-9d27-55cdba334d7d',
        cancer: 'ovarian',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20170119.somatic.cna.annotated.txt',
        thumbnail: THUMBNAILS[93]
    },
    {
        id: '7d332cb1-ba25-47e4-8bf8-d25e14f40d59',
        cancer: 'sarcoma',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20170119.somatic.cna.annotated.txt',
        thumbnail: THUMBNAILS[94]
    },
    {
        id: '9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa',
        cancer: 'kidney',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20170119.somatic.cna.annotated.txt',
        thumbnail: THUMBNAILS[95]
    },
    {
        id: 'b27d75ba-5989-4200-bfe9-f1b7d7cf8008',
        cancer: 'breast',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20170119.somatic.cna.annotated.txt',
        thumbnail: THUMBNAILS[96]
    },
    {
        id: 'fc8edf46-2005-1af4-e040-11ac0d481414',
        cancer: 'breast',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20170119.somatic.cna.annotated.txt',
        thumbnail: THUMBNAILS[97]
    },
    {
        id: 'SRR7890905',
        cancer: 'breast',
        assembly: 'hg38',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe',
        cnv: 'https://gist.githubusercontent.com/sehilyi/e3e19907a3d00638e8d3d0b0ddb56a26/raw/1ab8177946ec91394cb697621497acd7b9a513ff/SRR7890943.ascat.cnv.tsv',
        bam: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam',
        bai: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai',
        thumbnail: THUMBNAILS[98]
    },
    {
        id: 'SRR7890905 (V3)',
        cancer: 'breast',
        assembly: 'hg38',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe',
        cnv: 'https://gist.githubusercontent.com/sehilyi/6fbceae35756b13472332d6b81b10803/raw/596428a8b0ebc00e7f8cbc52b050db0fbd6e19a5/SRR7890943.ascat.v3.cnv.tsv',
        bam: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam',
        bai: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai',
        thumbnail: THUMBNAILS[99]
    }
];

export default samples;
