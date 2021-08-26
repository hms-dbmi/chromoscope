import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoslingComponent } from 'gosling.js';
import { debounce } from 'lodash';
import generateSpec from './spec-generator';
import packageJson from '../package.json';
import './App.css';
import { CommonEventData } from 'gosling.js/dist/src/core/api';
// import { GoslingApi } from 'gosling.js/dist/src/core/api'

const INIT_VIS_PANEL_WIDTH = window.innerWidth;
const CONFIG_PANEL_WIDTH = 400;
const VIS_PADDING = 60;
const CHROMOSOMES = ['chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chr20', 'chr21', 'chr22', 'chrX', 'chrY'];

function App() {

  const gosRef = useRef<any>(); // { api: GoslingApi }
  const [svUrl, setSvUrl] = useState('https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.pcawg_consensus_1.6.161022.somatic.sv.bedpe');
  const [cnvUrl, setCnvUrl] = useState('https://s3.amazonaws.com/gosling-lang.org/data/SV/84ca6ab0-9edc-4636-9d27-55cdba334d7d.consensus.20170119.somatic.cna.annotated.txt');
  const [showOverview, setShowOverview] = useState(true);
  const [showPutativeDriver, setShowPutativeDriver] = useState(true);
  const [visPanelWidth, setVisPanelWidth] = useState(INIT_VIS_PANEL_WIDTH - CONFIG_PANEL_WIDTH - VIS_PADDING * 2);
  const [overviewChr, setOverviewChr] = useState('');
  const [genomeViewChr, setGenomeViewChr] = useState('');
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if(!gosRef.current) return;
    
    gosRef.current.api.subscribe('click', (type: string, e: CommonEventData) => {
      // start and end positions are already cumulative values
      gosRef.current.api.zoomTo('bam-1', `chr1:${e.data.start1}-${e.data.end1}`, 2000, 100);
      gosRef.current.api.zoomTo('bam-2', `chr1:${e.data.start2}-${e.data.end2}`, 2000, 100);
    });

    return () => {
      gosRef.current.api.unsubscribe('click');
    };
  }, [gosRef]);

  useEffect(() => {
    if(!overviewChr) return;
    
    if(overviewChr.includes('chr')) {
      gosRef.current?.api.zoomTo('top-view', overviewChr, 0, 100);
      setGenomeViewChr(overviewChr);
    } else {
      gosRef.current?.api.zoomToExtent('top-view', 100);
    }
  }, [overviewChr]);

  useEffect(() => {
    if(!genomeViewChr) return;
    
    if(genomeViewChr.includes('chr')) {
      gosRef.current?.api.zoomTo('mid-view', genomeViewChr, 0, 100);
    } else {
      gosRef.current?.api.zoomToExtent('mid-view', 100);
    }
  }, [genomeViewChr]);

  // Change the width of the visualization panel
  useEffect(() => {
    window.addEventListener(
      'resize',
      debounce(() => {
        setVisPanelWidth(window.innerWidth - CONFIG_PANEL_WIDTH - VIS_PADDING * 2);
      }, 500)
    );
  }, []);

  const goslingComponent = useMemo(() => {
    const spec = JSON.parse(JSON.stringify(generateSpec({ svUrl, cnvUrl, showOverview, xOffset: 0, showPutativeDriver, width: visPanelWidth })));
    return (
      <GoslingComponent
        ref={gosRef}
        spec={spec}
        padding={0}
        margin={0}
        // theme={JSON.parse(JSON.stringify({
        //   base: 'light',
        //   axis: {
        //     tickColor: 'lightgray',
        //     baselineColor: 'lightgray'
        //   }
        // }))}
      />
    );
  }, [visPanelWidth, showOverview, showPutativeDriver, svUrl, cnvUrl]);

  return (
    <>
      <div className='config-panel' style={{width: CONFIG_PANEL_WIDTH - 40}}>
        {/* <div className='panel-title'>Configuration</div> */}
        <div className='config-panel-section-title'>Data</div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>SV<small></small></span>
          <span className='config-panel-input'>
            <input
              className="config-panel-search-box"
              type="text"
              value={svUrl}
              disabled={true}
            />
          </span>
        </div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>CNV<small></small></span>
          <span className='config-panel-input'>
            <input
              className="config-panel-search-box"
              type="text"
              value={cnvUrl}
              disabled={true}
            />
          </span>
        </div>
        <div className='config-panel-section-title'>Navigation</div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>Circular Overview</span>
          <span className='config-panel-input'>
            {(
              <select className='config-panel-dropdown' onChange={(e) => setOverviewChr(e.currentTarget.value)} value={overviewChr} disabled={!showOverview}>
                {['All', ...CHROMOSOMES].map(chr => { return (<option key={chr} value={chr}>{chr}</option>); })}
              </select>
            )}
          </span>
        </div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>Linear Genome View</span>
          <span className='config-panel-input'>
            {(
              <select className='config-panel-dropdown' onChange={(e) => setGenomeViewChr(e.currentTarget.value)} value={genomeViewChr}>
                {CHROMOSOMES.map(chr => { return (<option key={chr} value={chr}>{chr}</option>); })}
              </select>
            )}
          </span>
        </div>
        {/* <input
          className="config-panel-search-box"
          type="text"
          placeholder={"chr1 or chr1:100-10000"}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowUp":
                break;
              case "ArrowDown":
                break;
              case "Enter":
                setNavigationKeyword(e.currentTarget.value);
                break;
              case "Esc":
              case "Escape":
                break;
            }
          }}
        /> */}
        <div className='config-panel-section-title'>Visibility</div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>Circular Overview</span>
          <span className='config-panel-input'>
            <input type="checkbox" checked={showOverview} onChange={() => { setShowOverview(!showOverview); }}/>
          </span>
        </div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>Putative Driver Track</span>
          <span className='config-panel-input'>
            <input type="checkbox" checked={showPutativeDriver} onChange={() => { setShowPutativeDriver(!showPutativeDriver); }}/>
          </span>
        </div>
        <div className='config-panel-section-title'>Export</div>
        <div className='config-panel-button' onClick={() => gosRef.current?.api.exportPng()}>PNG</div>
      </div>
      <div className='vis-panel' style={{ height: `calc(100% - ${VIS_PADDING * 2}px)`, padding: VIS_PADDING }} onClick={() => setInteractive(false)}>
        {goslingComponent}
        <div className='vis-panel-title panel-title'><small>v{packageJson.dependencies['gosling.js']}</small></div>
      </div>
      {/* <div className={`vis-panel-overlay ${interactive ? 'vis-panel-overlay-active' : ''}`} style={{width: `calc(100% - ${CONFIG_PANEL_WIDTH + 1}px)`}} onClick={() => setInteractive(true)}>
        <span>Click to interact ...</span>
      </div> */}
    </>
  );
}

export default App;
