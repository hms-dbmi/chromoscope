---
sidebar_position: 3
---

# Use Case Data

1. [Cancers with pathogenic BRCA mutations](https://chromoscope.bio/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/pathogenicBrca/configs/pathogenicBrca.all.config.json)
    - 44 samples with BRCA1 or BRCA2 mutations.
    - The visualization shows that while both display prevalent chromosomal instability, BRCA1 cancers show predominance of tandem duplications, while BRCA2 cancers show dominance of deletions. 

1. [Breast cancer co-amplifications](https://chromoscope.bio/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/coamps/configs/coamps.all.config.withnotes.json)
    - It has been known that amplifications of chromosomes 8 and 11 in breast cancer co-occur. This analysis shows that the amplifications are often connected by inter-chromosomal translations, implicating chromosome 8/11 as an early event in their formation.
    - Adjacent segments of loss-of-heterozygosity (LOH) are consistent with this model of amplicon origin. The visualization highlights commonalities in features of the amplicons across 23 samples.

1. [Cancers with bi-allelic ATM mutations](https://chromoscope.bio/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/atm_bi/configs/atm_bi.all.config.json)
    - ATM plays a role in DNA repair.
    - The visualization features 21 cancers with pathogenic mutations in ATM, displaying a modest but non-characteristic pattern of chromosomal instability in this tumor group.

1. [Cancers with CCNE1 amplifications](https://chromoscope.bio/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/ccne1_amp/configs/ccne1_amp.all.config.json)
    - CCNE1 is commonly amplified across cancer types, and results in oncogenic stress.
    - This visualization of 58 cancers with CCNE1 amplification highlights the common tandem duplicator, and to a lesser extent, a deletion pattern which makes chromosomal instability in this tumor group.

1. [Cancers with bi-allelic loss of CDK12](https://chromoscope.bio/?showSamples=true&external=https://somatic-browser-test.s3.amazonaws.com/configs/allCDK12_fine.json)
    - Tumors with pathogenic CDK12 mutations display chromosomal instability.
    - This visualization of 12 cancers shows the genomes dominated by large (100kb) duplications, to a higher extent than the CCNE1 group. 
    - This visualization also features novel and compound patterns of structural variants ([example](https://chromoscope.bio/?demoIndex=4&domain=597601479.8815027-616292105.2587856&external=https://somatic-browser-test.s3.amazonaws.com/cdk12_oncokb_sel/configs/cdk12_oncokb_sel.all.config.json)).

:::info
Click on the link above to browse corresponding data using Chromoscope.
:::