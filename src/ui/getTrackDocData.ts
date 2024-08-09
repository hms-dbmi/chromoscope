import ideogram_interpretation_1 from '../script/img/popover-images/ideogram/interpretation_1.png';
import ideogram_interpretation_2 from '../script/img/popover-images/ideogram/interpretation_2.png';
import driver_interpretation_1 from '../script/img/popover-images/driver/interpretation_1.png';
import driver_interpretation_2 from '../script/img/popover-images/driver/interpretation_2.png';
import driver_interactions_1 from '../script/img/popover-images/driver/interactions_1.png';
import genes_interpretation_1 from '../script/img/popover-images/genes/interpretation_1.png';
import genes_interpretation_2 from '../script/img/popover-images/genes/interpretation_2.png';
import genes_interactions_1 from '../script/img/popover-images/genes/interactions_1.png';
import genes_interactions_2 from '../script/img/popover-images/genes/interactions_2.png';
import mutations_interpretation_1 from '../script/img/popover-images/mutations/interpretation_1.png';
import mutations_interactions_1 from '../script/img/popover-images/mutations/interactions_1.png';
import mutations_interactions_2 from '../script/img/popover-images/mutations/interactions_2.png';
import indel_interpretation_1 from '../script/img/popover-images/indel/interpretation_1.png';
import indel_interpretation_2 from '../script/img/popover-images/indel/interpretation_2.png';
import indel_interactions_1 from '../script/img/popover-images/indel/interactions_1.png';
import copy_number_variants_interpretation_1 from '../script/img/popover-images/copy_number_variants/interpretation_1.png';
import copy_number_variants_interpretation_2 from '../script/img/popover-images/copy_number_variants/interpretation_2.png';
import copy_number_variants_interactions_1 from '../script/img/popover-images/copy_number_variants/interactions_1.png';
import gains_interpretation_1 from '../script/img/popover-images/gains/interpretation_1.png';
import gains_interpretation_2 from '../script/img/popover-images/gains/interpretation_2.png';
import loh_interpretation_1 from '../script/img/popover-images/loh/interpretation_1.png';
import loh_interpretation_2 from '../script/img/popover-images/loh/interpretation_2.png';
import structural_variants_interpretation_1 from '../script/img/popover-images/structural_variants/interpretation_1.png';
import structural_variants_interactions_1 from '../script/img/popover-images/structural_variants/interactions_1.png';
import structural_variants_interactions_2 from '../script/img/popover-images/structural_variants/interactions_2.png';
import coverage_interpretation_1 from '../script/img/popover-images/coverage/interpretation_1.png';
import coverage_interpretation_2 from '../script/img/popover-images/coverage/interpretation_2.png';
import alignment_interpretation_1 from '../script/img/popover-images/alignment/interpretation_1.png';
import alignment_interpretation_2 from '../script/img/popover-images/alignment/interpretation_2.png';
import alignment_interpretation_3 from '../script/img/popover-images/alignment/interpretation_3.png';
import alignment_interactions_1 from '../script/img/popover-images/alignment/interactions_1.png';
import sequence_interpretation_1 from '../script/img/popover-images/sequence/interpretation_1.png';

export type Track =
    | 'ideogram'
    | 'gene'
    | 'mutation'
    | 'cnv'
    | 'sv'
    | 'indel'
    | 'driver'
    | 'gain'
    | 'loh'
    | 'coverage'
    | 'sequence'
    | 'alignment';

// TODO: Not ideal to hard coded!
// The heights of each track
export const getTrackDocData = (
    isMinimalMode: boolean
): { height: number; type: Track; title: string; popover_content?: string }[] => {
    return [
        {
            height: 50,
            type: 'ideogram',
            title: 'Ideogram',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr />
                        <div class="block with-image">
                            <img src="${ideogram_interpretation_1}" alt="Chromosome bands on Ideogram track." />
                            <div class="text">
                                <p><b>Black stripes</b> - indicate chromosome bands (cytobands) obtained from chromosome staining viewing under microscope.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${ideogram_interpretation_2}" alt="Chromosome centromeres on Ideogram track." />
                            <div class="text">
                                <p><span class="text-red"><b>Red Triangles</b></span> - represent chromosome centromeres.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            height: 40,
            type: 'driver',
            title: 'Putative Driver',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr class="header" />
                        <div class="section-content">
                            <div class="block with-image">
                                <img src="${driver_interpretation_1}" alt="Bi-allelic gene loss on Putative Driver track." />
                                <div class="text">
                                    <p><b>Circle with a dot</b> - denotes bi-allelic gene loss.</p>
                                    <p><b>Circle without a dot</b> - denotes one mutation in gene.</p>
                                </div>
                            </div>
                            <hr />
                            <div class="block with-image">
                            <img src="${driver_interpretation_2}" alt="Driver mutation names on Genome View." />
                                <div class="text">
                                    <p>Driver mutations are also annotated by name in the genome view.</p>
                                </div>
                            </div>
                            <hr />
                            <div class='block text-only'>
                                <p>Driver mutations need to be curated and pre-specified as part of Chromoscope configuration <a href="https://chromoscope.bio/loading-data/through-data-config" target="_blank" rel="noreferrer">data specification</a>.</p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class='section interactions'>
                        <h3>Interactions</h3>
                        <hr class="header" />
                        <div class="block with-image">
                            <img src="${driver_interactions_1}" alt="Putative Driver track annotation details pop up." />
                            <div class="text">
                                <p><b>Hover</b> - over driver variants to see annotation details.</p>
                            </div>
                        </div>
                    </div>
                </div>`
        },
        {
            height: 60,
            type: 'gene',
            title: 'Gene Annotation',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr class="header" />
                        <div class="block with-image">
                            <img src="${genes_interpretation_1}" alt="Gene Annotation track." />
                            <div class="text">
                                <p><b>Arrows</b> - represent genes.</p>
                                <p><b>Direction</b> - denotes gene strand.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${genes_interpretation_2}" alt="Exons on the Gene Annotation track." />
                            <div class="text">
                                <p><b>Thicker lines</b> - represent Exons.</p>
                            </div>
                        </div>
                    </div>
                    <div class='section interactions'>
                        <h3>Interactions</h3>
                        <hr class="header"/>
                        <div class="block with-image">
                            <img src="${genes_interactions_1}" alt="Gene Annotation track at low magnification." />
                            <div class="text">
                                <p><b>Zoom out</b> - to see only selected genes <a href="https://chromoscope.bio/visualizations/data-sampling/" target="_blank" rel="noreferrer">sampling info</a>.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${genes_interactions_2}" alt="Gene Annotation track at high magnification." />
                            <div class="text">
                                <p><b>Zoom in</b> - to a smaller region to see all genes in that region.</p>
                            </div>
                        </div>
                    </div>
                </div>`
        },
        {
            height: 60,
            type: 'mutation',
            title: 'Point Mutation',
            popover_content: `
            <div class='popover-content'>
                <div class='section interpretation'>
                    <h3>Interpretation</h3>
                    <hr class="header"/>
                    <div class="block with-image">
                        <img src="${mutations_interpretation_1}" alt="Point Mutation track y-axis." />
                        <div class="text">
                            <p><b>Y-axis</b> shows the distance (in kb) between adjacent point mutations, on a logarithmic scale.</p>
                        </div>
                    </div>
                    <hr class="my-3" />
                    <div class="block text-only">
                        <p>At low magnification, only selected mutations are visible. More information on sampling <a href="https://chromoscope.bio/visualizations/data-sampling/" target="_blank" rel="noreferrer">here</a>.</p>
                    </div>
                </div>
                <div class='section interactions'>
                    <h3>Interactions</h3>
                    <hr class="header" />
                    <div class="block with-image">
                        <img src="${mutations_interactions_1}" alt="Point Mutation track at high magnification." />
                        <div class="text">
                            <p>
                                <b>Zoom in</b> - to reveal more point mutations.
                            </p>
                        </div>
                    </div>
                    <hr/>
                    <div class="block with-image">
                        <img src="${mutations_interactions_2}" alt="Point Mutation track details pop up." />
                        <div class="text">
                            <p><b>Hover</b> - over a point mutation to see details.</p>
                        </div>
                    </div>
                </div>
            </div>`
        },
        {
            height: 40,
            type: 'indel',
            title: 'Indel',
            popover_content: `
            <div class='popover-content'>
                <div class='section interpretation'>
                    <h3>Interpretation</h3>
                    <hr class="header" />
                    <div class="section-content">
                        <div class="block text-only multi-paragraph">
                            <p><span class="text-orange"><b>Insertions</b></span> are identified when the alternative allele is longer than the reference allele by the number of basepairs inserted.</p>
                            <p><span class="text-green"><b>Deletions</b></span> are identified where the alternative allele is shorter by the number of basepairs that were deleted.</p>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${indel_interpretation_1}" alt="Indel track." />
                            <div class="text">
                                <p><span class="text-orange"><b>Orange lines</b></span> - mark insertions.</p>
                                <p><span class="text-green"><b>Green lines</b></span> - mark deletions.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${indel_interpretation_2}" alt="Indel track." />
                            <div class="text">
                                <p>When showing large chromosomal regions, Chromoscope selects 500 indels in each visible tile (<a href="https://chromoscope.bio/visualizations/data-sampling/#vcf--tbi" target="_blank" rel="noreferrer">see documentation on sampling</a>).</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='section interactions'>
                    <h3>Interactions</h3>
                    <hr class="header" />
                    <div class="block with-image">
                        <img src="${indel_interactions_1}" alt="Indel track details pop up." />
                        <div class="text">
                            <p><b>Hover</b> - on an insertion or deletion to see details.</p>
                        </div>
                    </div>
                </div>
            </div>`
        },
        {
            height: 60,
            type: 'cnv',
            title: 'Copy Number Variants',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr class="header" />
                        <div class="block with-image">
                            <img src="${copy_number_variants_interpretation_1}" alt="Copy Number Variants track." />
                            <div class="text">
                                <p><span class="text-gray"><b>Thick gray lines</b></span> - represent copy number profiles.</p>
                                <p><b>Y-axis</b> - represents the number of chromosome copies.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${copy_number_variants_interpretation_2}" alt="Copy Number Variants track." />
                            <div class="text">
                                <p>Copy number variants often coincide with structural variants.</p>
                            </div>
                        </div>
                    </div>
                    <div class='section interactions'>
                        <h3>Interactions</h3>
                        <hr class="header" />
                        <div class="block with-image">
                            <img src="${copy_number_variants_interactions_1}" alt="Copy number segment details pop up." />
                            <div class="text">
                                <p>
                                    <b>Hover</b> - over the copy number segment to see the number of copies of each chromosomal regions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            height: 20,
            type: 'gain',
            title: 'Gain',
            popover_content: `
            <div class='popover-content'>
                <div class='section interpretation'>
                    <h3>Interpretation</h3>
                    <hr class="header" />
                    <div class="block with-image">
                        <img src="${gains_interpretation_1}" alt="Gain track." />
                        <div class="text">
                            <p>Gains are declared in chromosomal regions where total number of copies exceeds 5.</p>
                        </div>
                    </div>
                    <hr />
                    <div class="block with-image">
                        <img src="${gains_interpretation_2}" alt="Region with Gains in Genome View." />
                        <div class="text">
                            <p>Regions with gains are marked in <span class="text-blue"><b>blue</b></span> on both Genome and Variant Views.</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        },
        {
            height: 20,
            type: 'loh',
            title: 'Loss of Heterozygosity',
            popover_content: `
            <div class='popover-content'>
                <div class='section interpretation'>
                <h3>Interpretation</h3>
                <hr class="header" />
                    <div class='block text-only'>
                        <p>LOH is declared in regions where a chromosome copy from one of the parents was entirely lost (minor copy number of 0).</p>
                    </div>
                    <div class="block with-image">
                        <img src="${loh_interpretation_1}" alt="Loss of Heterozygosity region in Variant View." />
                        <div class="text">
                            <p>Regions with LOH are marked in <span class="text-coral"><b>coral</b></span> in Variant View.</p>
                        </div>
                    </div>
                    <hr />
                    <div class="block with-image">
                        <img src="${loh_interpretation_2}" alt="Loss of Heterozygosity region in Genome View." />
                        <div class="text">
                            <p>Regions with LOH are marked in <span class="text-coral"><b>coral</b></span> in Genome View.</p>
                        </div>
                    </div>
                </div>
            </div>`
        },
        {
            height: 250 + (isMinimalMode ? 100 : 40) + 30,
            type: 'sv',
            title: 'Structural Variants',
            popover_content: `
             <div class='popover-content'>
                 <div class='section interpretation'>
                     <h3>Interpretation</h3>
                     <hr class="header"/>
                     <div class="block with-image">
                         <img src="${structural_variants_interpretation_1}" alt="Structural Variants track." />
                         <div class="text">
                             <p><b>Arches</b> - represent structural variants (SVs).</p>
                             <p><b>Colors</b> - denote different types of SVs.</p>
                         </div>
                     </div>
                 </div>
                 <div class='section interactions'>
                     <h3>Interactions</h3>
                     <hr class="header" />
                     <div class="block with-image">
                         <img src="${structural_variants_interactions_1}" alt="Structural Variants track with event highlighted." />
                         <div class="text">
                             <p><b>Click</b> - on an SV to show its breakpoints in the read view.</p>
                         </div>
                     </div>
                     <hr/>
                     <div class="block with-image">
                         <img src="${structural_variants_interactions_2}" alt="Event details pop up on Structural Variants track." />
                         <div class="text">
                             <p><b>Hover</b> - over a SV to see more information about each event.</p>
                         </div>
                     </div>
                 </div>
             </div>`
        },
        {
            height: 80,
            type: 'coverage',
            title: 'Coverage',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr class="header"/>
                        <div class="block text-only">
                            <p>The sequencing coverage track quantifies the number of sequencing reads covering each position.</p>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${coverage_interpretation_1}" alt="Coverage track." />
                            <div class="text">
                                <p><b>Black vertical dashed line</b> - denotes the selected breakpoint (if selected).</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${coverage_interpretation_2}" alt="Coverage, Sequence, and Alignment tracks." />
                            <div class="text">
                                <p>Sequencing coverage is derived from the data on sequencing reads aligning to each position.</p>
                                <br />
                                <p><b>Black reads</b> - (those parts of reads that were split) do not contribute to the coverage sum.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            height: 40,
            type: 'sequence',
            title: 'Sequence',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr class="header"/>
                        <div class="block with-image">
                            <img src="${sequence_interpretation_1}" alt="Color legend for the Sequence track." />
                            <div class="text">
                                <p><b>Colors</b> - represent DNA base-pairs in human reference genome.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            height: 50,
            type: 'alignment',
            title: 'Alignment',
            popover_content: `
                <div class='popover-content'>
                    <div class='section interpretation'>
                        <h3>Interpretation</h3>
                        <hr class="header"/>
                        <div class="block with-image">
                            <img src="${alignment_interpretation_1}" alt="Coverage, Sequence, and Alignment tracks." />
                            <div class="text">
                                <p><span class="text-gray"><b>Gray rectangles</b></span> - denote normally-mapping reads.</p>
                                <p><span><b>Black rectangles</b></span> - denote split reads, used as evidence for structural variants.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${alignment_interpretation_2}" alt="Green read colors in the Alignment track." />
                            <div class="text">
                                <p>Other read colors (e.g. <span class="text-green"><b>green</b></span>) denote aberrantly mapping reads, which are also used as evidence for structural variants <a href="https://chromoscope.bio/visualizations/breakpoint-view">(see more info)</a>.</p>
                            </div>
                        </div>
                        <hr />
                        <div class="block with-image">
                            <img src="${alignment_interpretation_3}" alt="Black vertical dashed line in the Alignment track." />
                            <div class="text">
                                <p><b>Black vertical dashed line</b> - denotes a SV breakpoint.</p>
                            </div>
                        </div>
                    </div>
                    <div class='section interactions'>
                        <h3>Interactions</h3>
                        <hr class="header" />
                        <div class="block with-image">
                            <img src="${alignment_interactions_1}" alt="ALignment track details pop up." />
                            <div class="text">
                                <p><b>Hover</b> - over a sequencing read to see more details.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    ];
};
