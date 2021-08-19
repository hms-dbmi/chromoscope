import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GoslingComponent } from 'gosling.js'
import { debounce } from 'lodash';
import generateSpec from './spec-generator';
import packageJson from '../package.json';
import './App.css'
// import { GoslingApi } from 'gosling.js/dist/src/core/api'

const INIT_VIS_PANEL_WIDTH = window.innerWidth;
const CONFIG_PANEL_WIDTH = 400;
const VIS_PADDING = 60;
const CHROMOSOMES = ["chr1", "chr2", "chr3", "chr4", "chr5", "chr6", "chr7", "chr8", "chr9", "chr10", "chr11", "chr12", "chr13", "chr14", "chr15", "chr16", "chr17", "chr18", "chr19", "chr20", 'chr21', 'chr22', 'chrX', 'chrY'];

function App() {

  const gosRef = useRef<any>(); // { api: GoslingApi }
  const [showOverview, setShowOverview] = useState(true);
  const [visPanelWidth, setVisPanelWidth] = useState(INIT_VIS_PANEL_WIDTH - CONFIG_PANEL_WIDTH - VIS_PADDING * 2);
  const [overviewChr, setOverviewChr] = useState('');
  const [genomeViewChr, setGenomeViewChr] = useState('');

  useEffect(() => {
    if(!overviewChr) return;
    
    if(overviewChr.includes('chr')) {
      gosRef.current?.api.zoomTo('top-view', overviewChr);
      setGenomeViewChr(overviewChr);
    } else {
      gosRef.current?.api.zoomToExtent('top-view');
    }
  }, [overviewChr]);

  useEffect(() => {
    if(!genomeViewChr) return;
    
    if(genomeViewChr.includes('chr')) {
      gosRef.current?.api.zoomTo('mid-view', genomeViewChr);
    } else {
      gosRef.current?.api.zoomToExtent('mid-view');
    }
  }, [genomeViewChr]);

  // Change the width of the visualization panel
  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(() => {
        setVisPanelWidth(window.innerWidth - CONFIG_PANEL_WIDTH - VIS_PADDING * 2);
      }, 1000)
    );
  }, []);

  const goslingComponent = useMemo(() => {
    return (
      <GoslingComponent
        ref={gosRef}
        spec={JSON.parse(JSON.stringify(generateSpec({ showOverview, width: visPanelWidth })))}
        padding={0}
        margin={0} />
    )
  }, [visPanelWidth, showOverview]);

  return (
    <>
      <div className='config-panel' style={{width: CONFIG_PANEL_WIDTH - 40}}>
        <div className='panel-title'>Configuration</div>
        <div className='config-panel-section-title'>Data</div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>SV<small>VCF</small></span>
          <span className='config-panel-input'>
            <input
              className="config-panel-search-box"
              type="text"
              value="https://..."
              disabled={true}
            />
          </span>
        </div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>CNV<small>BEDPE</small></span>
          <span className='config-panel-input'>
            <input
              className="config-panel-search-box"
              type="text"
              value="https://..."
              disabled={true}
            />
          </span>
        </div>
        <div className='config-panel-section-title'>Navigation</div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>Circos View</span>
          <span className='config-panel-input'>
            {(
              <select className='config-panel-dropdown' onChange={(e) => setOverviewChr(e.currentTarget.value)} value={overviewChr} disabled={!showOverview}>
                {['All', ...CHROMOSOMES].map(chr => { return (<option key={chr} value={chr}>{chr}</option>) })}
              </select>
            )}
          </span>
        </div>
        <div className='config-panel-input-container'>
          <span className='config-panel-label'>Linear Genome View</span>
          <span className='config-panel-input'>
            {(
              <select className='config-panel-dropdown' onChange={(e) => setGenomeViewChr(e.currentTarget.value)} value={genomeViewChr}>
                {CHROMOSOMES.map(chr => { return (<option key={chr} value={chr}>{chr}</option>) })}
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
        <span className='config-panel-label'>Show Circos View</span>
        <span className='config-panel-input'>
          <input type="checkbox" checked={showOverview} onChange={() => { setShowOverview(!showOverview) }}/>
        </span>
      </div>
      <div className='config-panel-section-title'>Export</div>
      <div className='config-panel-button' onClick={() => gosRef.current?.api.exportPng()}>PNG</div>
      </div>
      <div className='vis-panel' style={{ height: `calc(100% - ${VIS_PADDING * 2}px)`, padding: VIS_PADDING }}>
        {goslingComponent}
        <div className='vis-panel-title panel-title'><small>v{packageJson.dependencies['gosling.js']}</small></div>
      </div>
    </>
  )
}

export default App
