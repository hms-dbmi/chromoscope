import React, { useEffect, useState } from 'react';
import { embed } from 'gosling.js';

import { Database } from '../database';
import { BrowserDatabase } from '../browser-log';
import { SampleType } from '../data/samples';
import getOneOfSmallMultiplesSpec from '../small-multiples-spec';
import { INTERNAL_SAVED_THUMBNAILS } from '../data/external-thumbnails';
import THUMBNAIL_PLACEHOLDER from '../script/img/placeholder.png';
import { EXTERNAL_THUMBNAILS } from '../data/stevens-mpnst';
import { ICONS } from '../icon';

const db = new Database();
const log = new BrowserDatabase();

const DB_DO_NOT_SHOW_ABOUT_BY_DEFAULT = (await log.get())?.doNotShowAboutByDefault ?? false;
const DATABSE_THUMBNAILS = await db.get();
const GENERATED_THUMBNAILS = {};

const getThumbnail = (d: SampleType) => {
    return (
        d.thumbnail ||
        INTERNAL_SAVED_THUMBNAILS[d.id] ||
        EXTERNAL_THUMBNAILS[d.id] ||
        DATABSE_THUMBNAILS.find(db => db.id === d.id)?.dataUrl ||
        GENERATED_THUMBNAILS[d.id]
    );
};

const AvailabilityIcon = (isAvailable: boolean) => {
    return (
        <svg className="data-availability-checkbox" viewBox="0 0 16 16">
            <title>Checkbox</title>
            {(isAvailable ? ICONS.CHECKSQUARE : ICONS.SQUARE).path.map(p => (
                <path fill="currentColor" key={p} d={p} />
            ))}
        </svg>
    );
};

export const SmallOverviewWrapper = ({ demo, setDemo, demoIndex, filteredSamples, setShowSamples }) => {
    const [thumbnailForceGenerate, setThumbnailForceGenerate] = useState(false);
    const [generateThumbnails, setGenerateThumbnails] = useState(false);
    const [doneGeneratingThumbnails, setDoneGeneratingThumbnails] = useState(false);

    useEffect(() => {
        // !! Uncomment the following lines to generated specs for making thumbnails.
        // console.log(
        //     'overviewSpec',
        //     filteredSamples.map(d =>
        //         getOneOfSmallMultiplesSpec({
        //             cnvUrl: d.cnv,
        //             svUrl: d.sv,
        //             width: 1200,
        //             title: d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1),
        //             subtitle: d.id, // '' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : ''),
        //             cnFields: d.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
        //         })
        //     ),
        //     filteredSamples.map(d => `node gosling-screenshot.js output/${d.id}.json img/${d.id}.jpeg`).join('\n')
        // );
        // return [];
        /* Load image if necessary */
        const noThumbnail = filteredSamples.filter(d => !getThumbnail(d))[0];
        if (noThumbnail && generateThumbnails) {
            const { id } = noThumbnail;
            const spec = getOneOfSmallMultiplesSpec({
                cnvUrl: noThumbnail.cnv,
                svUrl: noThumbnail.sv,
                width: 600,
                title: noThumbnail.cancer.charAt(0).toUpperCase() + noThumbnail.cancer.slice(1),
                subtitle: id,
                cnFields: noThumbnail.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
            });
            const hidden = document.getElementById('hidden-gosling');
            embed(hidden, spec, { padding: 0, margin: 10 }).then(api => {
                setTimeout(() => {
                    const { canvas } = api.getCanvas();
                    const dataUrl = canvas.toDataURL('image/png');
                    GENERATED_THUMBNAILS[noThumbnail.id] = dataUrl;
                    db.add(id, dataUrl);
                    setThumbnailForceGenerate(!thumbnailForceGenerate);
                }, 10000);
            });
        }
        if (noThumbnail) {
            setDoneGeneratingThumbnails(false);
        } else {
            setDoneGeneratingThumbnails(true);
        }
        console.log('Filtered samples changed', filteredSamples);
    }, [demo, filteredSamples, thumbnailForceGenerate, generateThumbnails]);

    return filteredSamples.map((d, i) => (
        <div
            key={JSON.stringify(d.id)}
            onClick={() => {
                demoIndex.current = i;
                setShowSamples(false);
                setTimeout(() => {
                    setDemo(d);
                }, 300);
            }}
            className={'overview' + (demo === d ? ' selected-overview' : ' unselected-overview')}
        >
            <div style={{ fontWeight: 500 }}>{d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1).split(' ')[0]}</div>
            <div style={{ color: 'grey', fontSize: '14px' }}>
                {'' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : '')}
            </div>
            <div style={{ position: 'relative' }}>
                {getThumbnail(d) ? (
                    <img src={getThumbnail(d)} style={{ width: `${420 / 2}px`, height: `${420 / 2}px` }} />
                ) : (
                    // <div style={{ marginLeft: 'calc(50% - 105px - 10px)' }}>
                    //     <GoslingComponent
                    //         padding={0}
                    //         margin={10}
                    //         spec={getOneOfSmallMultiplesSpec({
                    //             cnvUrl: d.cnv,
                    //             svUrl: d.sv,
                    //             width: 210,
                    //             title: d.cancer.charAt(0).toUpperCase() + d.cancer.slice(1),
                    //             subtitle: d.id, // '' + d.id.slice(0, 20) + (d.id.length >= 20 ? '...' : ''),
                    //             cnFields: d.cnFields ?? ['total_cn', 'major_cn', 'minor_cn']
                    //         })}
                    //     />
                    // </div>
                    <>
                        <img src={THUMBNAIL_PLACEHOLDER} style={{ width: `${420 / 2}px`, height: `${420 / 2}px` }} />
                        <span className="thumbnail-loading-message">
                            {generateThumbnails ? 'Loading...' : 'Thumbnail Missing'}
                        </span>
                    </>
                )}
                <span className="tag-assembly">{d.assembly ?? 'hg38'}</span>
            </div>
            <div className="tag-parent">
                <div className={'tag-sv'}>{AvailabilityIcon(true)}SV</div>
                <div className={d.vcf && d.vcfIndex ? 'tag-pm' : 'tag-disabled'}>
                    {AvailabilityIcon(!!d.vcf && !!d.vcfIndex)}Point Mutation
                </div>
                <div className={d.vcf2 && d.vcf2Index ? 'tag-id' : 'tag-disabled'}>
                    {AvailabilityIcon(!!d.vcf2 && !!d.vcf2Index)}Indel
                </div>
                <div className={d.bam && d.bai ? 'tag-ra' : 'tag-disabled'}>
                    {AvailabilityIcon(!!d.bam && !!d.bai)}Read Alignment
                </div>
                {d.note ? <div className="tag-note">{d.note}</div> : null}
            </div>
        </div>
    ));
    // smallOverviewGoslingComponents.map(([component, spec], i) => (
    //     <div
    //         key={JSON.stringify(spec)}
    //         onClick={() => {
    //             setShowSamples(false);
    //             setTimeout(() => {
    //                 setDemoIdx(i);
    //                 setSelectedSvId('');
    //             }, 300);
    //         }}
    //         className={demoIdx === i ? 'selected-overview' : 'unselected-overview'}
    //     >
    //         {component}
    //     </div>
    // ));
};
