import { Assembly } from 'gosling.js/dist/src/gosling-schema';
import _7a921087 from '../script/img/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.jpeg';
import _84ca6ab0 from '../script/img/84ca6ab0-9edc-4636-9d27-55cdba334d7d.jpeg';
import _7d332cb1 from '../script/img/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.jpeg';
import _9ae0744a from '../script/img/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.jpeg';
import _b27d75ba from '../script/img/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.jpeg';
import _fc8edf46 from '../script/img/fc8edf46-2005-1af4-e040-11ac0d481414.jpeg';
import SRR7890905 from '../script/img/SRR7890905.jpg';
import SRR7890905_Hartwig from '../script/img/SRR7890905_Hartwig.jpg';
import _bc0dee07 from '../script/img/GACA-CN-bc0dee07-de20-44d6-be65-05af7e63ac96.jpeg';
import _f1504811 from '../script/img/OV-AU-f1504811-8363-41e6-b43c-62452b1262d3.jpeg';
import _89dad92e from '../script/img/OV-AU-89dad92e-5b3f-479a-a6da-a94ee7df7f8a.jpeg';
import _b243adb4 from '../script/img/OV-US-b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.jpeg';
import _84ca6ab0_OV from '../script/img/OV-US-84ca6ab0-9edc-4636-9d27-55cdba334d7d.jpeg';
import _0bfd1043 from '../script/img/OV-US-0bfd1043-816e-e3e4-e050-11ac0c4860c5.jpeg';

export type SampleType = {
    group: 'default' | 'doga' | 'vcf';
    id: string; // "aliquot ID"
    cancer: string; // cancer type
    assembly: Assembly; // hg19 or 38
    sv: string; // URL of bedpe
    cnv?: string; // URL of txt
    drivers?: { [k: string]: string | number }[] | string;
    bam?: string;
    bai?: string;
    baf?: string;
    vcf?: string;
    vcfIndex?: string;
    vcf2?: string;
    vcf2Index?: string;
    cnFields?: [string, string, string];
    thumbnail?: string;
    note?: string;
};

// const samples: SampleType[] = (pcawg as SampleType[]).map(d => { return { group: 'default', ...d }});
// console.log(samples);

const samples: SampleType[] = [
    {
        group: 'default',
        id: 'SRR7890905',
        cancer: 'breast',
        assembly: 'hg38',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/SNV_test_tumor_normal_with_panel.vcf.gz',
        vcfIndex: 'https://somatic-browser-test.s3.amazonaws.com/SNV_test_tumor_normal_with_panel.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/INDEL_test_tumor_normal_with_panel.vcf.gz',
        vcf2Index: 'https://somatic-browser-test.s3.amazonaws.com/INDEL_test_tumor_normal_with_panel.vcf.gz.tbi',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe',
        cnv: 'https://gist.githubusercontent.com/sehilyi/6fbceae35756b13472332d6b81b10803/raw/596428a8b0ebc00e7f8cbc52b050db0fbd6e19a5/SRR7890943.ascat.v3.cnv.tsv',
        bam: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam',
        bai: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai',
        note: 'CNV profile - ASCAT. SVs - Sentieon. Mutations and indels - Sentieon',
        thumbnail: SRR7890905
    },
    {
        group: 'default',
        id: 'SRR7890905_Hartwig',
        cancer: 'breast',
        assembly: 'hg38',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/SNV_test_tumor_normal_with_panel.vcf.gz',
        vcfIndex: 'https://somatic-browser-test.s3.amazonaws.com/SNV_test_tumor_normal_with_panel.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/INDEL_test_tumor_normal_with_panel.vcf.gz',
        vcf2Index: 'https://somatic-browser-test.s3.amazonaws.com/INDEL_test_tumor_normal_with_panel.vcf.gz.tbi',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905/SRR7890905.gripss.filtered.bedpe',
        cnv: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905/SRR7890905.purple.cnv.somatic.reformatted.tsv',
        bam: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam',
        bai: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai',
        note: 'CNV profile - Purple. SVs - Gridss. Mutations and indels - Sentieon',
        thumbnail: SRR7890905_Hartwig
    },
    {
        group: 'default',
        id: '7a921087-8e62-4a93-a757-fd8cdbe1eb8f',
        cancer: 'ovarian',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        // drivers: 'https://gist.githubusercontent.com/sehilyi/01096d32326da8e7f9acc48dd9790332/raw/4f2bbd96ce3d2b6637bd733674f60e197e4d4da9/json-driver.json', // json example
        thumbnail: _7a921087
    },
    {
        group: 'default',
        id: '7d332cb1-ba25-47e4-8bf8-d25e14f40d59',
        cancer: 'sarcoma',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20170119.somatic.cna.annotated.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _7d332cb1
    },
    {
        group: 'default',
        id: '9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa',
        cancer: 'kidney',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20170119.somatic.cna.annotated.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _9ae0744a
    },
    {
        group: 'default',
        id: 'b27d75ba-5989-4200-bfe9-f1b7d7cf8008',
        cancer: 'breast',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20170119.somatic.cna.annotated.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _b27d75ba
    },
    {
        group: 'default',
        id: 'fc8edf46-2005-1af4-e040-11ac0d481414',
        cancer: 'breast',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20170119.somatic.cna.annotated.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/browserExamples/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/browserExamples/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _fc8edf46
    },
    // {
    //     group: 'default',
    //     id: 'SRR7890905',
    //     cancer: 'breast',
    //     assembly: 'hg38',
    //     sv: 'https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe',
    //     cnv: 'https://gist.githubusercontent.com/sehilyi/6fbceae35756b13472332d6b81b10803/raw/596428a8b0ebc00e7f8cbc52b050db0fbd6e19a5/SRR7890943.ascat.v3.cnv.tsv',
    //     bam: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam',
    //     bai: 'https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai',
    //     thumbnail: _SRR7890905
    // },
    {
        group: 'default',
        id: 'bc0dee07-de20-44d6-be65-05af7e63ac96', // GACA-CN-
        cancer: 'gastric',
        assembly: 'hg19',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.pcawg_consensus_1.6.161116.somatic.sv.bedpe',
        cnv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20170119.somatic.cna.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _bc0dee07
    },
    {
        group: 'default',
        id: 'f1504811-8363-41e6-b43c-62452b1262d3', // OV-AU-
        cancer: 'ovarian',
        assembly: 'hg19',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/f1504811-8363-41e6-b43c-62452b1262d3.pcawg_consensus_1.6.161116.somatic.sv.bedpe',
        cnv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/f1504811-8363-41e6-b43c-62452b1262d3.consensus.20170119.somatic.cna.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/f1504811-8363-41e6-b43c-62452b1262d3.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/f1504811-8363-41e6-b43c-62452b1262d3.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/f1504811-8363-41e6-b43c-62452b1262d3.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/f1504811-8363-41e6-b43c-62452b1262d3.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _f1504811
    },
    {
        group: 'default',
        id: '89dad92e-5b3f-479a-a6da-a94ee7df7f8a', // OV-AU-
        cancer: 'ovarian',
        assembly: 'hg19',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/89dad92e-5b3f-479a-a6da-a94ee7df7f8a.pcawg_consensus_1.6.161116.somatic.sv.bedpe',
        cnv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/89dad92e-5b3f-479a-a6da-a94ee7df7f8a.consensus.20170119.somatic.cna.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/89dad92e-5b3f-479a-a6da-a94ee7df7f8a.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/89dad92e-5b3f-479a-a6da-a94ee7df7f8a.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/89dad92e-5b3f-479a-a6da-a94ee7df7f8a.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/89dad92e-5b3f-479a-a6da-a94ee7df7f8a.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _89dad92e
    },
    {
        group: 'default',
        id: 'b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be', // OV-US-
        cancer: 'ovarian serous cystadenocarcinoma',
        assembly: 'hg19',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.pcawg_consensus_1.6.161116.somatic.sv.bedpe',
        cnv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.consensus.20170119.somatic.cna.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/b243adb4-b3e7-4e0e-bc0d-625aa8dbb1be.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _b243adb4
    },
    {
        group: 'default',
        id: '84ca6ab0-9edc-4636-9d27-55cdba334d7d',
        cancer: 'ovarian',
        assembly: 'hg19',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20170119.somatic.cna.annotated.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _84ca6ab0
    },
    {
        group: 'default',
        id: '0bfd1043-816e-e3e4-e050-11ac0c4860c5', // OV-US-
        cancer: 'prostate adenocarcinoma',
        assembly: 'hg19',
        sv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/0bfd1043-816e-e3e4-e050-11ac0c4860c5.pcawg_consensus_1.6.161116.somatic.sv.bedpe',
        cnv: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/0bfd1043-816e-e3e4-e050-11ac0c4860c5.consensus.20170119.somatic.cna.txt',
        vcf: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/0bfd1043-816e-e3e4-e050-11ac0c4860c5.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz',
        vcfIndex:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/0bfd1043-816e-e3e4-e050-11ac0c4860c5.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi',
        vcf2: 'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/0bfd1043-816e-e3e4-e050-11ac0c4860c5.consensus.20161006.somatic.indel.sorted.vcf.gz',
        vcf2Index:
            'https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/0bfd1043-816e-e3e4-e050-11ac0c4860c5.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi',
        thumbnail: _0bfd1043
    }
];

export default samples;
