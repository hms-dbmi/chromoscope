import React from 'react';

import cohort_view from '../script/img/modal_images/getting_started/cohort_view.png';
import genome_view from '../script/img/modal_images/getting_started/genome_view.png';
import genome_view_brush from '../script/img/modal_images/getting_started/genome_view_brush.png';
import clinically_relevant_variants from '../script/img/modal_images/getting_started/clinically_relevant_variants.png';
import gene_search from '../script/img/modal_images/getting_started/gene_search.png';
import variant_view from '../script/img/modal_images/getting_started/variant_view.png';
import variant_view_sv from '../script/img/modal_images/getting_started/variant_view_sv.png';

export const GettingStartedModalContent: React.FC = () => {
    return (
        <div className="modal-body-content">
            <div className="section">
                <div className="section-header">
                    <h4>
                        <b>Getting Started:</b>
                    </h4>
                    <h3>
                        How to interpret structural variants in a cancer genome with Chromoscope
                    </h3>
                </div>

                <div className="section-labels">
                    <h4>View</h4>
                    <h4>Interactions</h4>
                    <h4>Interpretation</h4>
                </div>

                <div className="section-content">
                    <div className="block triad cohort">
                        <h5 className="block-header"><span><b>COHORT VIEW</b>: A global overview of all cases</span></h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img className="image" src={cohort_view} alt="Cursor selecting thumbnail in Cohort View." />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Click</b> - one thumbnail to inspect the case closer.
                                    </p>
                                    <a className="example-link" href="https://chromoscope.bio/app/?external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/configs/cell.line.benchmark.v3.json">
                                        Go to example case &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        The <b>patterns</b> of structural variants <b>represented by color lines</b> in the circles vary between cases.
                                    </p>
                                    <p>
                                        When present in <b>most chromosomes</b>, structural variants represent incorrectly repaired DNA breaks.
                                    </p>
                                    <p>
                                        Other catastrophic events can genertte structural variants focused on <b>individual chromosomes</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad genome">
                        <h5 className="block-header"><span><b>GENOME VIEW</b>: Overview of a single genome</span></h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img
                                    className="image"
                                    src={genome_view}
                                    alt="Cursor hovering over structural variant in Genome View."
                                />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Hover</b> - over a structural variant in the genome view to see the details.
                                    </p>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        This genome is full of <b>kilobase-size deletions</b>, tandem duplications, and translocations.
                                    </p>
                                    <p>
                                        This is a phenotype of homologous recombination deficiency, <b>often seen in cancers with BRCA1/2 loss</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad">
                        <div className="block-items">
                            <div className="block-item">
                            <img src={genome_view_brush} className="image" alt="Cursor adjusting brush on the Genome View." />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Move the blue brush</b> - in the genome view to chromosome 3 to inspect a chromosome with many structural variants in the variant view.
                                    </p>
                                    <a className="example-link" href="https://chromoscope.bio/app/?demoIndex=1&domain=541618015.9608195-600308246.5181853&external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/configs/cell.line.benchmark.v3.json">
                                        Go to the region shown &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        Complex structural variants coincide with an oscillating pattern in the copy number track, and adjacent loss-of-heterozygosity.
                                    </p>
                                </div>
                                <div className="text">
                                    <p>
                                        These features are consistent with chromothripsis - a catastrophic event that shatters a chromosome.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="block triad relevant-variants">
                        <div className="block-items">
                            <div className="block-item">
                                <img src={clinically_relevant_variants} className="image" alt="Clincically-relevant variants in the Clincal Interpretation panel." />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        In the genome interpretation panel on the right:
                                    </p>
                                </div>
                                <div className="text">
                                    <p>
                                        <b>Click</b> -  on deletion of the &apos;PTEN&apos; gene for a closer inspection.
                                    </p>
                                </div>
                                <div className="text">
                                    <p>
                                        When such annotation is absent for a given sample, you could <b>search</b> for the gene by its name in the search box.
                                    </p>
                                    <img className="gene-search-image" src={gene_search} alt="Gene search control." />
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        Only selected structural variants perturb genes, and only a subset of such events are <b>clinically-relevant</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad">
                        <h5 className="block-header"><span><b>VARIANT VIEW</b>: Impact of structural variants on genes</span></h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img className="image" src={variant_view} alt="Variant view tracks." />   
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Zoom in zoom out</b> - by mouse scrolling (up/down) or clicking the buttons.
                                        <span className="text-button-example">
                                            <b>+</b>
                                        </span>{' '}
                                        and{' '}
                                        <span className="text-button-example right">
                                            <b>-</b>
                                        </span>{' '}
                                        buttons.
                                    </p>
                                </div>
                                <div className="text">
                                    <p>
                                        <b>Scroll left or right</b> - by mouse scrolling (left/right) or clicking the buttons.
                                        <span className="text-button-example">
                                            <b>&larr;</b>
                                        </span>{' '}
                                        and{' '}
                                        <span className="text-button-example right">
                                            <b>&rarr;</b>
                                        </span>{' '}
                                        buttons.
                                    </p>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        Two structural variants <b>transect</b> PTEN - a tumor suppresor gene. Copy number changes <b>coincide</b> with the breakpoints of structural variants.
                                    </p>
                                    <p>
                                        The latter exons of PTEN have copy number of zero, meaning that the exons <b>are entirely lost</b> in tumor cells.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="block triad">
                        <h5 className="block-header"><span><b>READ VIEW</b>: Sequencing read support of SVs</span></h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img className="image" src={variant_view_sv} alt="Variant view track with structural variant selected." />   
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Click</b> - on the structural variant to highlight it.
                                    </p>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                    The read view shows sequencing reads around the breakpoints of selected structural variant. Black denotes &apos;split&apos; and blue denotes &apos;spanning&apos; reads.
                                    </p>
                                    <p>
                                        A good number of both suggest that the structural variant is real and was correctly called.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
