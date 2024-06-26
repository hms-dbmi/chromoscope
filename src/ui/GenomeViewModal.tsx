import React from 'react';
import genome_interactions_1 from '../script/img/modal_images/genome_view/interactions_1.png';

export const GenomeViewModal = () => {
    return (
        <div
            className="modal fade"
            id="genome-view-modal"
            tabIndex={-1}
            aria-labelledby="Genome View Instruction Modal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Genome View Instructions
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="popover-content">
                            <div className="section interactions">
                                <h4>Interactions</h4>
                                <hr className="header" />
                                <div className="section-content">
                                    <div className="block with-image">
                                        <img src={genome_interactions_1} alt="" />
                                        <div className="text">
                                            <p>
                                                <b>Circle with a dot</b> - denotes bi-allelic gene loss.
                                            </p>
                                            <p>
                                                <b>Circle without a dot</b> - denotes one mutation in gene.
                                            </p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="block with-image">
                                        <img src={genome_interactions_1} alt="" />
                                        <div className="text">
                                            <p>Driver mutations are also annotated by name in the genome view.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
