import React from 'react';

import cohort_view from '../script/img/modal_images/getting_started/cohort_view.png';
import genome_view from '../script/img/modal_images/getting_started/genome_view.png';
import genome_view_brush from '../script/img/modal_images/getting_started/genome_view_brush.png';
import clinically_relevant_variants from '../script/img/modal_images/getting_started/clinically_relevant_variants.png';
import gene_search from '../script/img/modal_images/getting_started/gene_search.png';
import variant_view from '../script/img/modal_images/getting_started/variant_view.png';
import variant_view_sv from '../script/img/modal_images/getting_started/variant_view_sv.png';
import read_view from '../script/img/modal_images/getting_started/read_view.png';

export const GettingStartedModalContent: React.FC = () => {
    return (
        <div className="modal-body-content">
            <div className="section">
                <div className="section-labels mb-5">
                    <h4>View</h4>
                    <h4>Interactions</h4>
                    <h4>Interpretation</h4>
                </div>

                <div className="section-content">
                    <div className="block triad cohort">
                        <h5 className="block-header">
                            <span>
                                <b>COHORT VIEW</b>: A global overview of all cases
                            </span>
                        </h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img
                                    className="image"
                                    src={cohort_view}
                                    alt="Cursor selecting thumbnail in Cohort View."
                                />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Click</b> - one thumbnail to go to a single case.
                                    </p>
                                    <a
                                        className="example-link"
                                        href="https://chromoscope.bio/app/?external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/configs/cell.line.benchmark.v4.json"
                                    >
                                        Go to example case &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        The <b>patterns</b> of structural variants <b>represented by color lines</b> in
                                        the circles vary between cases.
                                    </p>
                                    <p>
                                        When present in <b>most chromosomes</b>, structural variants represent
                                        incorrectly repaired DNA breaks.
                                    </p>
                                    <p>
                                        Other catastrophic events can generate structural variants focused on{' '}
                                        <b>individual chromosomes</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad genome">
                        <h5 className="block-header">
                            <span>
                                <b>GENOME VIEW</b>: Overview of a single genome
                            </span>
                        </h5>
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
                                        This genome is full of <b>kilobase-size</b> deletions, tandem duplications, and
                                        translocations.
                                    </p>
                                    <p>
                                        This is a phenotype of homologous recombination deficiency,{' '}
                                        <b>often seen in cancers with BRCA1/2 loss</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad">
                        <div className="block-items">
                            <div className="block-item">
                                <img
                                    src={genome_view_brush}
                                    className="image"
                                    alt="Cursor adjusting brush on the Genome View."
                                />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Move the blue brush</b> - in the genome view to chromosome 3 to inspect a
                                        region with many structural variants in the variant view.
                                    </p>
                                    <a
                                        className="example-link"
                                        href="https://chromoscope.bio/app/?demoIndex=1&domain=541618015.9608195-600308246.5181853&external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/configs/cell.line.benchmark.v4.json"
                                    >
                                        Go to the region shown &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        Complex structural variants coincide with an <b>oscillating pattern</b> in the
                                        copy number track, and adjacent loss-of-heterozygosity.
                                    </p>
                                </div>
                                <div className="text">
                                    <p>
                                        These features are consistent with chromothripsis - a <b>catastrophic event</b>{' '}
                                        that shatters a chromosome.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad relevant-variants">
                        <div className="block-items">
                            <div className="block-item">
                                <img
                                    src={clinically_relevant_variants}
                                    className="image"
                                    alt="Clincically-relevant variants in the Clincal Interpretation panel."
                                />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>In the genome interpretation panel on the right:</p>
                                </div>
                                <div className="text">
                                    <p>
                                        <b>Click</b> - on deletion of the &apos;PTEN&apos; gene for a closer inspection.
                                    </p>
                                </div>
                                <div className="text">
                                    <p>
                                        When such annotation is absent for a given sample, you could <b>search</b> for
                                        the gene by its name in the search box.
                                    </p>
                                    <img className="gene-search-image" src={gene_search} alt="Gene search control." />
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        Only selected structural variants perturb genes, and only a subset of such
                                        events are <b>clinically-relevant</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad">
                        <h5 className="block-header">
                            <span>
                                <b>VARIANT VIEW</b>: Impact of structural variants on genes
                            </span>
                        </h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img className="image" src={variant_view} alt="Variant view tracks." />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p className="mb-2">
                                        <b>Zoom in zoom out</b> - by mouse scrolling (up/down) or clicking the buttons.
                                    </p>
                                    <span className="text-button-example">
                                        <b>+</b>
                                    </span>
                                    <span className="text-button-example right">
                                        <b>-</b>
                                    </span>
                                </div>
                                <div className="text mt-3">
                                    <p className="mb-2">
                                        <b>Scroll left or right</b> - by mouse scrolling (left/right) or clicking the
                                        buttons.
                                    </p>
                                    <p>
                                        <span className="text-button-example">
                                            <b>&larr;</b>
                                        </span>
                                        <span className="text-button-example right">
                                            <b>&rarr;</b>
                                        </span>
                                    </p>
                                    <a
                                        className="example-link"
                                        href="https://chromoscope.bio/app/?demoIndex=1&domain=1762699483.8734035-1762917689.7196426&external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/configs/cell.line.benchmark.v4.json"
                                    >
                                        Go to PTEN SV &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        Two structural variants <b>transect</b> PTEN - a tumor suppressor gene.
                                    </p>
                                    <p>
                                        Copy number changes <b>coincide</b> with the breakpoints of structural variants.
                                    </p>
                                    <p>
                                        The latter exons of PTEN have copy number of zero, meaning that the{' '}
                                        <b>exons are entirely lost</b> in tumor cells.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad">
                        <div className="block-items">
                            <div className="block-item">
                                <img
                                    className="image"
                                    src={variant_view_sv}
                                    alt="Variant view track with structural variant selected."
                                />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Click</b> - on the structural variant to highlight it.
                                    </p>
                                    <a
                                        className="example-link"
                                        href="https://chromoscope.bio/app/?demoIndex=1&domain=1762823513.7500365-1762908325.2499635&external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/configs/cell.line.benchmark.v4.json"
                                    >
                                        PTEN SV in focus &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>Selecting a structual variant will bring up the read view.</p>
                                    <p>
                                        Sequencing reads reveal the level of support for SVs, allowing us to determine
                                        whether the variant is real or not.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="block triad">
                        <h5 className="block-header">
                            <span>
                                <b>READ VIEW</b>: Sequencing read support of SVs
                            </span>
                        </h5>
                        <div className="block-items">
                            <div className="block-item">
                                <img
                                    className="image"
                                    src={read_view}
                                    alt="Variant view track with structural variant selected."
                                />
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        <b>Dashed vertical lines</b> - represent the positions of breakpoints of the
                                        structural variant selected.
                                    </p>
                                </div>
                            </div>
                            <div className="block-item">
                                <div className="text">
                                    <p>
                                        The read view shows sequencing reads around the breakpoints of the selected
                                        structural variant.
                                    </p>
                                    <p>
                                        <b>Black</b> denotes &apos;split&apos; and{' '}
                                        <span className="text-dark-blue">
                                            <b>blue</b>
                                        </span>{' '}
                                        denotes &apos;spanning&apos; reads.
                                    </p>
                                    <p>
                                        A good number of both suggests that the <b>structural variant is real</b> and
                                        was correctly called.
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
