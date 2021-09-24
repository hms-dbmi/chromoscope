import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoslingComponent } from "gosling.js";
import { debounce } from "lodash";
import generateSpec from "./spec-generator";
import packageJson from "../package.json";
import { CommonEventData } from "gosling.js/dist/src/core/api";
import "./App.css";

import drivers from "./data/driver.json";
import samples from "./data/samples";
import getSmallOverviewSpec from "./overview-spec";

const INIT_VIS_PANEL_WIDTH = window.innerWidth;
const CONFIG_PANEL_WIDTH = 400;
const OVERVIEW_PANEL_HEIGHT = 300;
const VIS_PADDING = 60;
const CHROMOSOMES = [
  "chr1",
  "chr2",
  "chr3",
  "chr4",
  "chr5",
  "chr6",
  "chr7",
  "chr8",
  "chr9",
  "chr10",
  "chr11",
  "chr12",
  "chr13",
  "chr14",
  "chr15",
  "chr16",
  "chr17",
  "chr18",
  "chr19",
  "chr20",
  "chr21",
  "chr22",
  "chrX",
  "chrY",
];
const ZOOM_PADDING = 100;
const ZOOM_DURATION = 1000;

function App() {
  const gosRef = useRef<any>();

  // demo
  const [demoIdx, setDemoIdx] = useState(0);
  const [sampleId, setSampleId] = useState(samples[demoIdx].id);
  const [svUrl, setSvUrl] = useState(samples[demoIdx].sv);
  const [cnvUrl, setCnvUrl] = useState(samples[demoIdx].cnv);

  // update demo
  useEffect(() => {
    setSampleId(samples[demoIdx].id);
    setSvUrl(samples[demoIdx].sv);
    setCnvUrl(samples[demoIdx].cnv);
  }, [demoIdx]);

  // interactions
  const [showOverview, setShowOverview] = useState(true);
  const [showPutativeDriver, setShowPutativeDriver] = useState(true);
  const [visPanelWidth, setVisPanelWidth] = useState(
    INIT_VIS_PANEL_WIDTH - CONFIG_PANEL_WIDTH - VIS_PADDING * 2
  );
  const [overviewChr, setOverviewChr] = useState("");
  const [genomeViewChr, setGenomeViewChr] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState(
    (drivers as any).filter(
      (d: any) => d.sample_id === sampleId && +d.chr && +d.pos
    )
  );
  const [hoveredSvId, setHoveredSvId] = useState<string>("");
  const [selectedSvId, setSelectedSvId] = useState<string>("");
  const [initInvervals, setInitInvervals] = useState<
    [number, number, number, number]
  >([1, 100, 1, 100]);

  useEffect(() => {
    if (!gosRef.current) return;

    gosRef.current.api.subscribe(
      "click",
      (type: string, e: CommonEventData) => {
        if (selectedSvId !== "") {
          // start and end positions are already cumulative values
          gosRef.current.api.zoomTo(
            "bottom-left-coverage-view",
            `chr1:${e.data.start1}-${e.data.end1}`,
            ZOOM_PADDING,
            ZOOM_DURATION
          );
          gosRef.current.api.zoomTo(
            "bottom-right-coverage-view",
            `chr1:${e.data.start2}-${e.data.end2}`,
            ZOOM_PADDING,
            ZOOM_DURATION
          );
        } else {
          // we will show the bam files, so set the initial positions
          setInitInvervals([
            +e.data.start1 - ZOOM_PADDING,
            +e.data.end1 + ZOOM_PADDING,
            +e.data.start2 - ZOOM_PADDING,
            +e.data.end2 + ZOOM_PADDING,
          ]);
        }

        setSelectedSvId(e.data.sv_id + "");
      }
    );

    gosRef.current.api.subscribe(
      "mouseover",
      (type: string, e: CommonEventData) => {
        // setHoveredSvId(e.data.sv_id + '');
      }
    );

    return () => {
      gosRef.current.api.unsubscribe("click");
      gosRef.current.api.unsubscribe("mouseover");
    };
  }, [gosRef]);

  useEffect(() => {
    if (!overviewChr) return;

    if (overviewChr.includes("chr")) {
      gosRef.current?.api.zoomTo(
        "top-ideogram-view",
        overviewChr,
        0,
        ZOOM_DURATION
      );
      setGenomeViewChr(overviewChr);
    } else {
      gosRef.current?.api.zoomToExtent("top-ideogram-view", ZOOM_DURATION);
    }
  }, [overviewChr]);

  useEffect(() => {
    if (!genomeViewChr) return;

    if (genomeViewChr.includes("chr")) {
      gosRef.current?.api.zoomTo(
        "mid-ideogram-view",
        genomeViewChr,
        0,
        ZOOM_DURATION
      );
    } else {
      gosRef.current?.api.zoomToExtent("mid-ideogram-view", ZOOM_DURATION);
    }
  }, [genomeViewChr]);

  // Change the width of the visualization panel
  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(() => {
        setVisPanelWidth(
          window.innerWidth - CONFIG_PANEL_WIDTH - VIS_PADDING * 2
        );
      }, 500)
    );
  }, []);

  const smallOverviewGoslingComponents = useMemo(() => {
    const specs = samples.map((d) =>
      getSmallOverviewSpec({
        cnvUrl: d.cnv,
        svUrl: d.sv,
        width: 200,
        title: d.id,
      })
    );
    return specs.map((spec) => (
      <GoslingComponent
        key={JSON.stringify(spec)}
        ref={gosRef}
        spec={spec}
        padding={0}
        margin={0}
        theme={{
          base: "light",
          root: {
            background: "transparent",
            titleFontFamily: "Roboto Condensed",
            subtitleFontFamily: "Roboto Condensed",
            subtitleAlign: "middle",
            subtitleColor: "gray",
            subtitleFontSize: 10,
            subtitleFontWeight: "bold",
          },
        }}
      />
    ));
  }, []);

  const smallOverviewWrapper = useMemo(() => {
    return smallOverviewGoslingComponents.map((component, i) => (
      <td
        key={i}
        onClick={() => setDemoIdx(i)}
        className={demoIdx === i ? "selected-overview" : ""}
      >
        {component}
      </td>
    ));
  }, [demoIdx]);

  const goslingComponent = useMemo(() => {
    const spec = generateSpec({
      title: `Sample ID: ${sampleId}`,
      subtitle:
        "Click on a SV arc in the linear view to see alignments around two breakpoints...",
      svUrl,
      cnvUrl,
      showOverview,
      xOffset: 0,
      showPutativeDriver,
      width: visPanelWidth,
      drivers: filteredDrivers,
      selectedSvId,
      hoveredSvId,
      initInvervals,
    });
    return (
      <GoslingComponent
        ref={gosRef}
        spec={spec}
        padding={0}
        margin={0}
        // theme={JSON.parse(JSON.stringify({
        //   base: 'light',
        //   root: {
        //     titleFontFamily: "Roboto Condensed"
        //   }
        // }))}
      />
    );
  }, [
    visPanelWidth,
    showOverview,
    showPutativeDriver,
    svUrl,
    cnvUrl,
    selectedSvId,
    hoveredSvId,
    initInvervals,
  ]);

  return (
    <>
      <div className="config-panel" style={{ width: CONFIG_PANEL_WIDTH - 40 }}>
        <div className="config-panel-section-title">Sample</div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">
            ID<small></small>
          </span>
          <span className="config-panel-input">
            <input
              className="config-panel-search-box"
              type="text"
              value={sampleId}
              disabled={true}
            />
          </span>
        </div>
        <div className="config-panel-section-title">Data</div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">
            SV<small></small>
          </span>
          <span className="config-panel-input">
            <input
              className="config-panel-search-box"
              type="text"
              value={svUrl}
              disabled={true}
            />
          </span>
        </div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">
            CNV<small></small>
          </span>
          <span className="config-panel-input">
            <input
              className="config-panel-search-box"
              type="text"
              value={cnvUrl}
              disabled={true}
            />
          </span>
        </div>
        <div className="config-panel-section-title">Navigation</div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">Circular Overview</span>
          <span className="config-panel-input">
            {
              <select
                className="config-panel-dropdown"
                onChange={(e) => setOverviewChr(e.currentTarget.value)}
                value={overviewChr}
                disabled={!showOverview}
              >
                {["All", ...CHROMOSOMES].map((chr) => {
                  return (
                    <option key={chr} value={chr}>
                      {chr}
                    </option>
                  );
                })}
              </select>
            }
          </span>
        </div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">Linear Genome View</span>
          <span className="config-panel-input">
            {
              <select
                className="config-panel-dropdown"
                onChange={(e) => setGenomeViewChr(e.currentTarget.value)}
                value={genomeViewChr}
              >
                {CHROMOSOMES.map((chr) => {
                  return (
                    <option key={chr} value={chr}>
                      {chr}
                    </option>
                  );
                })}
              </select>
            }
          </span>
        </div>
        <div className="config-panel-section-title">Visibility</div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">Circular Overview</span>
          <span className="config-panel-input">
            <input
              type="checkbox"
              checked={showOverview}
              onChange={() => {
                setShowOverview(!showOverview);
              }}
            />
          </span>
        </div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">Putative Driver Track</span>
          <span className="config-panel-input">
            <input
              type="checkbox"
              checked={showPutativeDriver}
              onChange={() => {
                setShowPutativeDriver(!showPutativeDriver);
              }}
            />
          </span>
        </div>
        <div className="config-panel-section-title">Export</div>
        <div
          className="config-panel-button"
          onClick={() => gosRef.current?.api.exportPng()}
        >
          PNG
        </div>
      </div>
      <div id="vis-panel" className="vis-panel">
        <div
          className="vis-overview-panel"
          style={{ height: `${OVERVIEW_PANEL_HEIGHT}px` }}
        >
          <table>
            <tr>{smallOverviewWrapper}</tr>
          </table>
          <div className="overview-title">Samples</div>
        </div>
        <div
          className="gosling-panel"
          style={{
            width: `calc(100% - ${VIS_PADDING * 2}px)`,
            height: `calc(100% - (${
              VIS_PADDING * 1
            }px + ${OVERVIEW_PANEL_HEIGHT}px))`,
            padding: VIS_PADDING,
          }}
        >
          {goslingComponent}
        </div>
        <div className="vis-panel-title panel-title">
          <small>v{packageJson.dependencies["gosling.js"]}</small>
        </div>
      </div>
    </>
  );
}

export default App;
