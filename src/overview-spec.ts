import defaultEncodings from "./default-encoding";
import { GoslingSpec } from "gosling.js/dist/src/core/gosling.schema";

type SpecOption = {
  cnvUrl: string;
  svUrl: string;
  width: number;
  title: string;
};

function getSmallOverviewSpec(option: SpecOption): GoslingSpec {
  const { title, cnvUrl, svUrl, width } = option;

  return {
    subtitle: title,
    views: [
      {
        static: true,
        layout: "circular",
        spacing: 1,
        style: {
          // outlineWidth: 1,
          outline: "lightgray",
        },
        tracks: [
          {
            data: {
              url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
              type: "csv",
              chromosomeField: "Chromosome",
              genomicFields: ["chromStart", "chromEnd"],
            },
            mark: "rect",
            color: {
              field: "Chromosome",
              type: "nominal",
              domain: [
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
              ],
              range: ["#F6F6F6", "lightgray"],
            },
            x: {
              field: "chromStart",
              type: "genomic",
              aggregate: "min",
              axis: "none",
            },
            xe: { field: "chromEnd", aggregate: "max", type: "genomic" },
            stroke: { value: "gray" },
            strokeWidth: { value: 0.5 },
            style: { outline: "black" },
            width,
            height: 30,
          },
          {
            // title: "Gain",
            // style: { background: "lightgray", backgroundOpacity: 0.2 },
            alignment: "overlay",
            data: {
              separator: "\t",
              url: cnvUrl,
              type: "csv",
              chromosomeField: "chromosome",
              genomicFields: ["start", "end"],
              quantitativeFields: ["total_cn"],
            },
            dataTransform: [
              {
                type: "filter",
                field: "total_cn",
                inRange: [4.9999, 999999999],
              },
            ],
            tracks: [
              { mark: "rect" },
              {
                mark: "brush",
                x: { linkingId: "mid-scale" },
                strokeWidth: { value: 0 },
              },
            ],
            x: { field: "start", type: "genomic" },
            xe: { field: "end", type: "genomic" },
            color: { value: "#73C475" },
            width,
            height: 40,
          },
          {
            // title: "LOH",
            // style: { background: "lightgray", backgroundOpacity: 0.2 },
            alignment: "overlay",
            data: {
              separator: "\t",
              url: cnvUrl,
              type: "csv",
              chromosomeField: "chromosome",
              genomicFields: ["start", "end"],
            },
            dataTransform: [
              { type: "filter", field: "minor_cn", oneOf: ["0"] },
            ],
            tracks: [
              { mark: "rect" },
              {
                mark: "brush",
                x: { linkingId: "mid-scale" },
                strokeWidth: { value: 1 },
                stroke: { value: "#94C2EF" },
                color: { value: "#AFD8FF" },
              },
            ],
            x: { field: "start", type: "genomic" },
            xe: { field: "end", type: "genomic" },
            color: { value: "#FB6A4B" },
            width,
            height: 40,
          },
          {
            // title: "Structural Variant",
            data: {
              url: svUrl,
              type: "csv",
              separator: "\t",
              genomicFieldsToConvert: [
                {
                  chromosomeField: "chrom1",
                  genomicFields: ["start1", "end1"],
                },
                {
                  chromosomeField: "chrom2",
                  genomicFields: ["start2", "end2"],
                },
              ],
            },
            mark: "withinLink",
            x: { field: "start1", type: "genomic" },
            xe: { field: "end2", type: "genomic" },
            color: {
              field: "svclass",
              type: "nominal",
              legend: false,
              domain: defaultEncodings.color.svclass.domain,
              range: defaultEncodings.color.svclass.range,
            },
            stroke: {
              field: "svclass",
              type: "nominal",
              domain: defaultEncodings.color.svclass.domain,
              range: defaultEncodings.color.svclass.range,
            },
            strokeWidth: { value: 1 },
            opacity: { value: 0.6 },
            style: { legendTitle: "SV Class" },
            width,
            height: 80,
          },
        ],
      },
    ],
  };
}

export default getSmallOverviewSpec;
