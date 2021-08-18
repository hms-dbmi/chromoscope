import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GoslingComponent } from 'gosling.js'
import { debounce } from 'lodash';
import generateSpec from './spec-generator';
import './App.css'
import { GoslingApi } from 'gosling.js/dist/src/core/api'

const INIT_VIS_PANEL_WIDTH = window.innerWidth;
const CONFIG_PANEL_WIDTH = 600;
const VIS_PADDING = 60;

function App() {

  const gosRef = useRef<{ api: GoslingApi }>();
  const [visPanelWidth, setVisPanelWidth] = useState(INIT_VIS_PANEL_WIDTH - CONFIG_PANEL_WIDTH - VIS_PADDING * 2);
  const [navigationKeyword, setNavigationKeyword] = useState('');

  useEffect(() => {
    if(!navigationKeyword) return;
    
    if(navigationKeyword.includes('chr')) {
      gosRef.current?.api.zoomTo('mid-view', navigationKeyword);
    } else {
      gosRef.current?.api.zoomToGene('mid-view', navigationKeyword);
    }
  }, [navigationKeyword]);

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
        spec={JSON.parse(JSON.stringify(generateSpec({ width: visPanelWidth })))}
        padding={0}
        margin={0} />
    )
  }, [visPanelWidth]);

  return (
    <>
      <div className='config-panel' style={{width: CONFIG_PANEL_WIDTH - 40}}>
        <div className='config-panel-title'>Configuration</div>
        <div className='config-panel-section-title'>Data</div>
        <input
          className="config-panel-search-box"
          type="text"
          value="https://..."
          disabled={true}
        />
        <div className='config-panel-section-title'>Navigation</div>
        <input
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
        />
      <div className='config-panel-button' onClick={() => gosRef.current?.api.exportPng()}>Export PNG</div>
      </div>
      <div className='vis-panel' style={{ height: `calc(100% - ${VIS_PADDING * 2}px)`, padding: VIS_PADDING }}>
        {goslingComponent}
        <div className='vis-panel-title'>Visualization</div>
      </div>
    </>
  )
}

export default App
