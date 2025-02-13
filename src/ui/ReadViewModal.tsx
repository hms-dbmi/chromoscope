import React from 'react';

import read_interactions_1 from '../script/img/modal_images/read_view/interactions_1.png';
import read_interpretation_1 from '../script/img/modal_images/read_view/interpretation_1.png';
import read_interpretation_2 from '../script/img/modal_images/read_view/interpretation_2.png';
import read_interpretation_3 from '../script/img/modal_images/read_view/interpretation_3.png';

export const ReadViewModalContent = () => {
    return (
        <div className="modal-body-content">
            <div className="section interpretation">
                <h3>Interpretation</h3>
                <hr className="header" />
                <div className="section-content">
                    <div className="block with-image">
                        <img src={read_interactions_1} alt="Read View tracks." />
                        <div className="text">
                            <p>
                                <b>Hover</b> - on a sequencing read to see details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section interactions">
                <h3>Interactions</h3>
                <hr className="header" />
                <div className="section-content">
                    <div className="block with-image">
                        <img src={read_interpretation_1} alt="Read View tracks." />
                        <div className="text">
                            <p>
                                Reads in <b>black</b> denote split reads, which are used as evidence for structural
                                variants.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img src={read_interpretation_2} alt="Read View tracks." />
                        <div className="text">
                            <p>
                                Other read colors (here,{' '}
                                <span className="text-green-alignment">
                                    <b>green</b>
                                </span>
                                ) denote aberrantly mapping reads, which are used as evidence for structural variants.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img src={read_interpretation_3} alt="Read View tracks." />
                        <div className="text">
                            <p>
                                Dotted vertical lines represent the breakpoints of a selected structural variant. The
                                &lsquo;cliff&rsquo; corresponds to a deletion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ReadViewModal: React.FC = () => {
    return (
        <div
            className="modal fade"
            id="read-view-modal"
            tabIndex={-1}
            aria-labelledby="Read View Instruction Modal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Read View Instructions
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <ReadViewModalContent />
                    </div>
                </div>
            </div>
        </div>
    );
};
