const samples: {
    id: string; // "aliquot ID"
    cancer: string; // cancer type
    sv: string; // URL of bedpe
    cnv: string; // URL of txt
    bam: string; // URL of bam
    bai: string; // URL of bai
}[] = [
    {
        id: '7a921087-8e62-4a93-a757-fd8cdbe1eb8f',
        cancer: 'ovarian',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.47ec48d1-bb40-4404-9fb3-a563b969b51d.bam',
        bai: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.47ec48d1-bb40-4404-9fb3-a563b969b51d.bam.bai'
    },
    {
        id: '84ca6ab0-9edc-4636-9d27-55cdba334d7d',
        cancer: 'ovarian',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://s3.amazonaws.com/gosling-lang.org/data/PCAWG.00e7f3bd-5c87-40c2-aeb6-4e4ca4a8e720.bam',
        bai: 'https://s3.amazonaws.com/gosling-lang.org/data/PCAWG.00e7f3bd-5c87-40c2-aeb6-4e4ca4a8e720.bam.bai'
    },
    {
        id: '7d332cb1-ba25-47e4-8bf8-d25e14f40d59',
        cancer: 'sarcoma',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.27a255b4-0479-4aff-95ae-9d23c6975739.bam',
        bai: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.27a255b4-0479-4aff-95ae-9d23c6975739.bam.bai'
    },
    {
        id: '9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa',
        cancer: 'kidney',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/9ae0744a-9bc1-4cd7-b7cf-c6569ed9e4aa.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.251466ea-c72f-4004-900f-e6b2d667f7ea.bam',
        bai: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.251466ea-c72f-4004-900f-e6b2d667f7ea.bam.bai'
    },
    {
        id: 'b27d75ba-5989-4200-bfe9-f1b7d7cf8008',
        cancer: 'breast',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/b27d75ba-5989-4200-bfe9-f1b7d7cf8008.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.c8e7bbdb-6d87-445f-bf43-dbf88805b1ed.bam',
        bai: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/PCAWG.c8e7bbdb-6d87-445f-bf43-dbf88805b1ed.bam.bai'
    },
    {
        id: 'fc8edf46-2005-1af4-e040-11ac0d481414',
        cancer: 'breast',
        sv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/4bcf4f050a418a10e324fae4392a7ebc.bam',
        bai: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/4bcf4f050a418a10e324fae4392a7ebc.bam.bai'
    },
    {
        id: 'SRR7890905',
        cancer: 'breast',
        sv: 'https://somatic-browser-test.s3.us-east-1.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEYaCXVzLWVhc3QtMiJGMEQCIFqctQIo%2BRQkFAsvEiZvX9MqZjtnfCsyaoKTBl3gl4PNAiAualwKpMY47ArnvvA08bmT3Z3a4Pbs%2BxQhOqfDPzoDQSqJBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDkyMjcyOTU2ODUzMiIMiBilUMwXRidijR0nKt0DY4shjUpttYTKgiXFTKsIBPD2J2vLFqkgI8PKexYeiuJ2ucKolsGaoLx%2BonMYs1GqO8z2l0lAzNpTBBRhq1Y%2FYVj77j%2FUcE%2B7vKDL3hs4gVw6Edx5YpBfXaWa6duRX3V6V109%2BXWM8jeZJsp5OTsSOKZoWFtjrqmvfyLfKboGUoBeOO5TLJA0ZcjqgxNfaPtgzsi%2FEn125%2F3dSPvYub2zhwq%2BB5c1UDAlkj7bjnxKZ%2FDQSD3KGravrbjJGeOw%2F9Yblvk3f78JWY2qWkYkcQQfVmMUdXq1JUGp3G%2FPpfseeszzfKP0YM8opj5eAj3E1x%2FW%2FVu2MRcbPG4Tp8YGzaHkhiJ3vYAHwXsyxC7KiKcv4qfftviNZvZmaitx%2FyWCvYgIZm1dyWQiL8Mef34QpwdUTXsg7j7sWY4YRyGKlnd9ldpOlgNOgu%2B5xQ7sdPAsNOZoFLozkVOQCJ%2BS%2BXqi%2Bfg%2FFbnCeN31xuS1NrrC0LdBlzWMHu7cPsSoH9pmTBNeDxAsbQzgd9P9TO7Hnn3%2FWLuTXIdICAD52ehoNRHafbV8a1OBgVe1Y2kCDACFJ%2Fz3Dv1R%2Bdm9M3daDwqCya2TxBxdvw16hXbncgSP7FUWHvB1OOGBkGWmCWD3RmBpEbLNMPKb0pEGOpUCk%2BIj0roHr6Bn75M56l6FCykG988LyVy58AsnVmWqDIdQPUK%2Bk7d6EjwJitw6jtUO1csGZ7SG7CS%2BrQuUd4lRl55DiNIGEk6jbfqIBO%2BiTsv4M5om8w1Jp3FTB4KQu8uickwcAwpFCaNCghM0quU0axaAO3wz1JWg6gh4Yx2avfvNSspeVrFpu9U1QFh0wBW7Di88QZAqIRxJvBzGVWLbPnthd0sCONTov31OSGwQ23LYWa%2B9Eyp0zEkY8%2BpsOkAoDLTF4HH2WFgEHNunowuu5%2Fsja48V%2FKUgXzJ7nr4xGgtyJ61x5Pi%2BIMhSDnC3N9oqPlTK3%2BYX5DCjnMT3Yx1q8cZUP%2F1CgKlyycJ0EzbSLsNbbHuYCA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220318T135048Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=ASIA5NVXX3EKJU6VTEV7%2F20220318%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2cda055c95c7d2b6f01b262bf182cbeac22a6ed68b92f8e61003ef68341fc98b',
        cnv: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/fc8edf46-2005-1af4-e040-11ac0d481414.consensus.20170119.somatic.cna.annotated.txt',
        bam: 'https://somatic-browser-test.s3.us-east-1.amazonaws.com/SRR7890905_GAPFI2USVS21.bam?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEYaCXVzLWVhc3QtMiJGMEQCIFqctQIo%2BRQkFAsvEiZvX9MqZjtnfCsyaoKTBl3gl4PNAiAualwKpMY47ArnvvA08bmT3Z3a4Pbs%2BxQhOqfDPzoDQSqJBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDkyMjcyOTU2ODUzMiIMiBilUMwXRidijR0nKt0DY4shjUpttYTKgiXFTKsIBPD2J2vLFqkgI8PKexYeiuJ2ucKolsGaoLx%2BonMYs1GqO8z2l0lAzNpTBBRhq1Y%2FYVj77j%2FUcE%2B7vKDL3hs4gVw6Edx5YpBfXaWa6duRX3V6V109%2BXWM8jeZJsp5OTsSOKZoWFtjrqmvfyLfKboGUoBeOO5TLJA0ZcjqgxNfaPtgzsi%2FEn125%2F3dSPvYub2zhwq%2BB5c1UDAlkj7bjnxKZ%2FDQSD3KGravrbjJGeOw%2F9Yblvk3f78JWY2qWkYkcQQfVmMUdXq1JUGp3G%2FPpfseeszzfKP0YM8opj5eAj3E1x%2FW%2FVu2MRcbPG4Tp8YGzaHkhiJ3vYAHwXsyxC7KiKcv4qfftviNZvZmaitx%2FyWCvYgIZm1dyWQiL8Mef34QpwdUTXsg7j7sWY4YRyGKlnd9ldpOlgNOgu%2B5xQ7sdPAsNOZoFLozkVOQCJ%2BS%2BXqi%2Bfg%2FFbnCeN31xuS1NrrC0LdBlzWMHu7cPsSoH9pmTBNeDxAsbQzgd9P9TO7Hnn3%2FWLuTXIdICAD52ehoNRHafbV8a1OBgVe1Y2kCDACFJ%2Fz3Dv1R%2Bdm9M3daDwqCya2TxBxdvw16hXbncgSP7FUWHvB1OOGBkGWmCWD3RmBpEbLNMPKb0pEGOpUCk%2BIj0roHr6Bn75M56l6FCykG988LyVy58AsnVmWqDIdQPUK%2Bk7d6EjwJitw6jtUO1csGZ7SG7CS%2BrQuUd4lRl55DiNIGEk6jbfqIBO%2BiTsv4M5om8w1Jp3FTB4KQu8uickwcAwpFCaNCghM0quU0axaAO3wz1JWg6gh4Yx2avfvNSspeVrFpu9U1QFh0wBW7Di88QZAqIRxJvBzGVWLbPnthd0sCONTov31OSGwQ23LYWa%2B9Eyp0zEkY8%2BpsOkAoDLTF4HH2WFgEHNunowuu5%2Fsja48V%2FKUgXzJ7nr4xGgtyJ61x5Pi%2BIMhSDnC3N9oqPlTK3%2BYX5DCjnMT3Yx1q8cZUP%2F1CgKlyycJ0EzbSLsNbbHuYCA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220318T134958Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=ASIA5NVXX3EKJU6VTEV7%2F20220318%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8f8650f774b6166cee86a5fc880834bd7d41edb08ea3f7c9ff6d4776e6700e9e',
        bai: 'https://somatic-browser-test.s3.us-east-1.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEYaCXVzLWVhc3QtMiJGMEQCIFqctQIo%2BRQkFAsvEiZvX9MqZjtnfCsyaoKTBl3gl4PNAiAualwKpMY47ArnvvA08bmT3Z3a4Pbs%2BxQhOqfDPzoDQSqJBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDkyMjcyOTU2ODUzMiIMiBilUMwXRidijR0nKt0DY4shjUpttYTKgiXFTKsIBPD2J2vLFqkgI8PKexYeiuJ2ucKolsGaoLx%2BonMYs1GqO8z2l0lAzNpTBBRhq1Y%2FYVj77j%2FUcE%2B7vKDL3hs4gVw6Edx5YpBfXaWa6duRX3V6V109%2BXWM8jeZJsp5OTsSOKZoWFtjrqmvfyLfKboGUoBeOO5TLJA0ZcjqgxNfaPtgzsi%2FEn125%2F3dSPvYub2zhwq%2BB5c1UDAlkj7bjnxKZ%2FDQSD3KGravrbjJGeOw%2F9Yblvk3f78JWY2qWkYkcQQfVmMUdXq1JUGp3G%2FPpfseeszzfKP0YM8opj5eAj3E1x%2FW%2FVu2MRcbPG4Tp8YGzaHkhiJ3vYAHwXsyxC7KiKcv4qfftviNZvZmaitx%2FyWCvYgIZm1dyWQiL8Mef34QpwdUTXsg7j7sWY4YRyGKlnd9ldpOlgNOgu%2B5xQ7sdPAsNOZoFLozkVOQCJ%2BS%2BXqi%2Bfg%2FFbnCeN31xuS1NrrC0LdBlzWMHu7cPsSoH9pmTBNeDxAsbQzgd9P9TO7Hnn3%2FWLuTXIdICAD52ehoNRHafbV8a1OBgVe1Y2kCDACFJ%2Fz3Dv1R%2Bdm9M3daDwqCya2TxBxdvw16hXbncgSP7FUWHvB1OOGBkGWmCWD3RmBpEbLNMPKb0pEGOpUCk%2BIj0roHr6Bn75M56l6FCykG988LyVy58AsnVmWqDIdQPUK%2Bk7d6EjwJitw6jtUO1csGZ7SG7CS%2BrQuUd4lRl55DiNIGEk6jbfqIBO%2BiTsv4M5om8w1Jp3FTB4KQu8uickwcAwpFCaNCghM0quU0axaAO3wz1JWg6gh4Yx2avfvNSspeVrFpu9U1QFh0wBW7Di88QZAqIRxJvBzGVWLbPnthd0sCONTov31OSGwQ23LYWa%2B9Eyp0zEkY8%2BpsOkAoDLTF4HH2WFgEHNunowuu5%2Fsja48V%2FKUgXzJ7nr4xGgtyJ61x5Pi%2BIMhSDnC3N9oqPlTK3%2BYX5DCjnMT3Yx1q8cZUP%2F1CgKlyycJ0EzbSLsNbbHuYCA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220318T135014Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=ASIA5NVXX3EKJU6VTEV7%2F20220318%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=70a1b7feb2528b181facd8ed339fa874f04eca7dacd52e39a79fd04c3731297d'
    }
];

export default samples;
