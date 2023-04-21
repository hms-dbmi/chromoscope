import React, { useMemo, useState } from 'react';
import { SampleType } from '../data/samples';
import { ICONS } from '../icon';

type SampleConfig = Partial<Omit<SampleType, 'group' | 'cnFields' | 'note' | 'drivers' | 'assembly' | 'thumbnail'>> & {
    drivers?: string;
    assembly?: 'hg19' | 'hg38';
};

type ValidSampleConfig = Required<Pick<SampleConfig, 'id' | 'cancer' | 'sv' | 'cnv' | 'assembly'>> &
    Omit<SampleConfig, 'id' | 'cancer' | 'sv' | 'cnv' | 'assembly'>;

function isValidUrl(str: string) {
    let url;
    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}

const testOkay = {
    id: (_: SampleConfig) => _.id,
    cancer: (_: SampleConfig) => _.cancer,
    sv: (_: SampleConfig) => isValidUrl(_.sv),
    cnv: (_: SampleConfig) => isValidUrl(_.cnv),
    // optional
    drivers: (_: SampleConfig) => !_.drivers || isValidUrl(_.drivers),
    vcf: (_: SampleConfig) => !_.vcf || isValidUrl(_.vcf),
    vcfIndex: (_: SampleConfig) => !_.vcfIndex || isValidUrl(_.vcfIndex),
    vcf2: (_: SampleConfig) => !_.vcf2 || isValidUrl(_.vcf2),
    vcf2Index: (_: SampleConfig) => !_.vcf2Index || isValidUrl(_.vcf2Index),
    bam: (_: SampleConfig) => !_.bam || isValidUrl(_.bam),
    bai: (_: SampleConfig) => !_.bai || isValidUrl(_.bai)
};

export default function SampleConfigForm(props: { onAdd: (config: ValidSampleConfig) => void }) {
    const { onAdd } = props;
    const [sampleConfig, setSampleConfig] = useState<SampleConfig>({});
    const sampleOkayToAdd = useMemo(() => {
        let okay = true;
        Object.keys(testOkay).map(k => {
            okay = okay && testOkay[k](sampleConfig);
        });
        return okay;
    }, [sampleConfig]);

    return (
        <div className="menu-container">
            <div className="menu-title">
                <span className="menu-title">Add New Sample</span>
                <span
                    className="menu-icon"
                    style={{ float: 'right', marginRight: '40px' }}
                    onClick={() => window.open('https://chromoscope.bio/docs/#/data-config', '_blank')}
                >
                    <svg width={16} height={16} viewBox={ICONS.DOCS.viewBox}>
                        {ICONS.DOCS.path.map(d => (
                            <path key={d} fill="currentColor" d={d} />
                        ))}
                    </svg>
                </span>
            </div>
            <div className="sample-config-form">
                <div className="menu-subtitle">Assembly</div>
                <select
                    className="menu-dropdown"
                    onChange={e =>
                        setSampleConfig({ ...sampleConfig, assembly: e.currentTarget.value as 'hg19' | 'hg38' })
                    }
                    value={sampleConfig.assembly}
                >
                    <option key={'hg19'} value={'hg19'}>
                        hg19
                    </option>
                    <option key={'hg38'} value={'hg38'}>
                        hg38
                    </option>
                </select>

                <span className="menu-subtitle">
                    ID<sup>*</sup>
                </span>
                {/* <span className="menu-subtitle-right">Required</span> */}
                <input
                    type="text"
                    className={testOkay.id(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="My sample 1, etc"
                    required
                    onChange={e => setSampleConfig({ ...sampleConfig, id: e.currentTarget.value })}
                    value={sampleConfig.id}
                />

                <div className="menu-subtitle">
                    Cancer<sup>*</sup>
                </div>
                {/* <span className="menu-subtitle-right">Required</span> */}
                <input
                    type="text"
                    className={testOkay.cancer(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="Gastric, Ovary, Prostate, etc"
                    required
                    onChange={e => setSampleConfig({ ...sampleConfig, cancer: e.currentTarget.value })}
                    value={sampleConfig.cancer}
                />

                <div className="menu-subtitle">
                    SV<sup>*</sup> <small>(.bedpe)</small>
                </div>
                {/* <span className="menu-subtitle-right">Required</span> */}
                <input
                    type="text"
                    className={testOkay.sv(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    required
                    onChange={e => setSampleConfig({ ...sampleConfig, sv: e.currentTarget.value })}
                    value={sampleConfig.sv}
                />

                <div className="menu-subtitle">
                    CNV<sup>*</sup> <small>(.txt)</small>
                </div>
                {/* <span className="menu-subtitle-right">Required</span> */}
                <input
                    type="text"
                    className={testOkay.cnv(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    required
                    onChange={e => setSampleConfig({ ...sampleConfig, cnv: e.currentTarget.value })}
                    value={sampleConfig.cnv}
                />

                <div className="menu-subtitle">
                    Drivers <small>(.txt)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.drivers(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, drivers: e.currentTarget.value })}
                    value={sampleConfig.drivers}
                />

                <div className="menu-subtitle">
                    Point Mutation <small>(.vcf)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.vcf(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, vcf: e.currentTarget.value })}
                    value={sampleConfig.vcf}
                />

                <div className="menu-subtitle">
                    Point Mutation Index <small>(.tbi)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.vcfIndex(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, vcfIndex: e.currentTarget.value })}
                    value={sampleConfig.vcfIndex}
                />

                <div className="menu-subtitle">
                    Indel <small>(.vcf)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.vcf2(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, vcf2: e.currentTarget.value })}
                    value={sampleConfig.vcf2}
                />

                <div className="menu-subtitle">
                    Indel Index <small>(.tbi)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.vcf2Index(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, vcf2Index: e.currentTarget.value })}
                    value={sampleConfig.vcf2Index}
                />

                <div className="menu-subtitle">
                    Read Alignment <small>(.bam)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.bam(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, bam: e.currentTarget.value })}
                    value={sampleConfig.bam}
                />

                <div className="menu-subtitle">
                    Read Alignment Index <small>(.bai)</small>
                </div>
                <input
                    type="text"
                    className={testOkay.bai(sampleConfig) ? 'menu-text-input' : 'menu-text-input-invalid'}
                    placeholder="https://..."
                    onChange={e => setSampleConfig({ ...sampleConfig, bai: e.currentTarget.value })}
                    value={sampleConfig.bai}
                />
                <div className="menu-subtitle" style={{ float: 'right' }}>
                    * Required Fields
                </div>
                <button
                    className={sampleOkayToAdd ? 'menu-button' : 'menu-button-disallowed'}
                    onClick={() => onAdd(sampleConfig as ValidSampleConfig)}
                >
                    Add
                </button>
            </div>
        </div>
    );
}
