import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoslingComponent } from "gosling.js";
import { debounce, isEqual, uniqueId } from "lodash";
import generateSpec from "./spec-generator";
import packageJson from "../package.json";
import {
  CommonEventData,
  RawDataEventData,
} from "gosling.js/dist/src/core/api";
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
const ZOOM_PADDING = 200;
const ZOOM_DURATION = 1000;
const theme = {
  base: "light",
  root: {
    background: "transparent",
    subtitleAlign: "middle",
    subtitleColor: "gray",
    subtitleFontSize: 10,
    subtitleFontWeight: "bold",
  },
};

function App() {
  const gosRef = useRef<any>();

  // TODO: We could just use sampleId to get detailed info. not to update all info as states.
  // demo
  const [demoIdx, setDemoIdx] = useState(0);
  const [sampleId, setSampleId] = useState(samples[demoIdx].id);
  const [svUrl, setSvUrl] = useState(samples[demoIdx].sv);
  const [cnvUrl, setCnvUrl] = useState(samples[demoIdx].cnv);
  const [bamUrl, setBamUrl] = useState(samples[demoIdx].bam);
  const [baiUrl, setBaiUrl] = useState(samples[demoIdx].bai);

  // update demo
  useEffect(() => {
    setSampleId(samples[demoIdx].id);
    setSvUrl(samples[demoIdx].sv);
    setCnvUrl(samples[demoIdx].cnv);
    setBamUrl(samples[demoIdx].bam);
    setBaiUrl(samples[demoIdx].bai);
    setFilteredDrivers(
      (drivers as any).filter(
        (d: any) => d.sample_id === sampleId && +d.chr && +d.pos
      )
    );
  }, [demoIdx]);

  // interactions
  const [showSamples, setShowSamples] = useState(false);
  const [showOverview, setShowOverview] = useState(true);
  const [showPutativeDriver, setShowPutativeDriver] = useState(false);
  const [svTransparency, setSvTransparency] = useState(0.3);
  const [visPanelWidth, setVisPanelWidth] = useState(
    INIT_VIS_PANEL_WIDTH - VIS_PADDING * 2
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

  // SV data
  const leftReads = useRef<{ [k: string]: number | string }[]>([]);
  const rightReads = useRef<{ [k: string]: number | string }[]>([]);
  const [svReads, setSvReads] = useState<{ name: string; type: string }[]>([]);

  useEffect(() => {
    if (!gosRef.current) return;

    gosRef.current.api.subscribe(
      "click",
      (type: string, e: CommonEventData) => {
        if (selectedSvId !== "") {
          // start and end positions are already cumulative values
          gosRef.current.api.zoomTo(
            `${sampleId}-bottom-left-coverage`,
            `chr1:${e.data.start1}-${e.data.end1}`,
            ZOOM_PADDING,
            ZOOM_DURATION
          );
          gosRef.current.api.zoomTo(
            `${sampleId}-bottom-right-coverage`,
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
      "rawdata",
      (type: string, e: RawDataEventData) => {
        if (e.id.includes("bam")) {
          if (e.id.includes("left")) {
            leftReads.current = e.data;
          } else {
            rightReads.current = e.data;
          }
          if (
            leftReads.current.length !== 0 &&
            rightReads.current.length !== 0
          ) {
            const mates = leftReads.current
              .filter(
                (l) =>
                  rightReads.current.filter(
                    (r) => r.name === l.name && r.id !== l.id
                  ).length !== 0
              )
              .map((d) => d.name as string)
              .sort();

            if (
              mates.join() !==
              svReads
                .map((d) => d.name)
                .sort()
                .join()
            ) {
              const matesWithSv = mates.map((name) => {
                const ld = leftReads.current.filter((d) => d.name === name)[0]
                  .strand;
                const rd = rightReads.current.filter((d) => d.name === name)[0]
                  .strand;
                if (ld === "+" && rd === "-")
                  return { name, type: "deletion (+-)" };
                else if (ld === "+" && rd === "+")
                  return { name, type: "inversion (++)" };
                else if (ld === "-" && rd === "-")
                  return { name, type: "inversoin (--)" };
                else if (ld === "-" && rd === "+")
                  return { name, type: "duplication (-+)" };
                else return { name, type: "unknown" };
              });
              // console.log("mates", matesWithSv)
              setSvReads(matesWithSv);
            }
          }
        }
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
      gosRef.current.api.unsubscribe("rawdata");
    };
  }, [gosRef, svReads, sampleId]);

  useEffect(() => {
    if (!overviewChr) return;

    if (overviewChr.includes("chr")) {
      gosRef.current?.api.zoomTo(
        `${sampleId}-top-ideogram-view`,
        overviewChr,
        0,
        ZOOM_DURATION
      );
      setGenomeViewChr(overviewChr);
    } else {
      gosRef.current?.api.zoomToExtent(
        `${sampleId}-top-ideogram-view`,
        ZOOM_DURATION
      );
    }
  }, [overviewChr]);

  useEffect(() => {
    if (!genomeViewChr) return;

    if (genomeViewChr.includes("chr")) {
      gosRef.current?.api.zoomTo(
        `${sampleId}-mid-ideogram-view`,
        genomeViewChr,
        0,
        ZOOM_DURATION
      );
    } else {
      gosRef.current?.api.zoomToExtent(
        `${sampleId}-mid-ideogram-view`,
        ZOOM_DURATION
      );
    }
  }, [genomeViewChr]);

  // Change the width of the visualization panel
  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(() => {
        setVisPanelWidth(window.innerWidth - VIS_PADDING * 2);
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
    return specs.map((spec) => [
      <GoslingComponent
        key={JSON.stringify(spec)}
        ref={gosRef}
        spec={spec}
        padding={0}
        margin={0}
        theme={theme as any}
      />,
      spec,
    ]);
  }, []);

  const smallOverviewWrapper = useMemo(() => {
    return smallOverviewGoslingComponents.map(([component, spec], i) => (
      <tr key={JSON.stringify(spec)}>
        <td
          onClick={() => setDemoIdx(i)}
          className={
            demoIdx === i ? "selected-overview" : "unselected-overview"
          }
        >
          {component}
        </td>
      </tr>
    ));
  }, [demoIdx]);

  const goslingComponent = useMemo(() => {
    const spec = generateSpec({
      sampleId,
      title: `Sample ID: ${sampleId}`,
      subtitle:
        "Click on a SV arc in the linear view to see alignments around two breakpoints...",
      svUrl,
      cnvUrl,
      bamUrl,
      baiUrl,
      showOverview,
      xOffset: 0,
      showPutativeDriver,
      svTransparency,
      width: visPanelWidth,
      drivers: filteredDrivers,
      selectedSvId,
      hoveredSvId,
      initInvervals,
      svReads,
    });
    // console.log(spec);
    return (
      <GoslingComponent
        ref={gosRef}
        spec={spec}
        padding={0}
        margin={0}
        experimental={{ reactive: true }}
        theme={theme}
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
    svTransparency,
    svReads,
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
            BAM<small></small>
          </span>
          <span className="config-panel-input">
            <input
              className="config-panel-search-box"
              type="text"
              value={bamUrl}
              disabled={true}
            />
          </span>
        </div>
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
        {/* <div className="config-panel-section-title">Encoding</div>
        <div className="config-panel-input-container">
          <span className="config-panel-label">SV Transparency</span>
          <span className="config-panel-input">
            <input 
              type="range" 
              min={0}
              max={1}
              step={0.01} 
              value={svTransparency}
              className="slider" 
              style={{ width: 100, display: 'inline', margin: 10}}
              onChange={(e) => setSvTransparency(+e.currentTarget.value) }
            />
          </span>
        </div> */}
        <div className="config-panel-section-title">Export</div>
        <div
          className="config-panel-button"
          onClick={() => gosRef.current?.api.exportPng()}
        >
          PNG
        </div>
      </div>
      <svg
        className="config-button"
        viewBox="0 0 16 16"
        onClick={() => {
          setShowSamples(true);
        }}
      >
        <title>Menu</title>
        <path
          fillRule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
        />
      </svg>
      <div className="sample-label">SAMPLE{" • " + sampleId}</div>
      <div id="vis-panel" className="vis-panel">
        <div className={"vis-overview-panel " + (!showSamples ? "hide" : "")}>
          <div className="title">
            Samples
            <svg
              className="button"
              viewBox="0 0 16 16"
              onClick={() => {
                setShowSamples(false);
              }}
            >
              <title>Close</title>
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="config">
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
            <div
              className="config-panel-button"
              onClick={() => gosRef.current?.api.exportPng()}
            >
              Export PNG
            </div>
          </div>
          <table>{smallOverviewWrapper}</table>
        </div>
        <div
          className="gosling-panel"
          style={{
            width: `calc(100% - ${VIS_PADDING * 2}px)`,
            height: `calc(100% - ${VIS_PADDING * 2}px)`,
            padding: VIS_PADDING,
          }}
        >
          {goslingComponent}
        </div>
      </div>
    </>
  );
}

export default App;
