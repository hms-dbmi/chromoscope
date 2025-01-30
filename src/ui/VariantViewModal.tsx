import React from 'react';

import variant_interpretation_1 from '../script/img/modal_images/variant_view/interpretation_1.png';
import variant_interactions_1 from '../script/img/modal_images/variant_view/interactions_1.png';
import variant_interactions_2 from '../script/img/modal_images/variant_view/interactions_2.png';
import variant_interactions_3 from '../script/img/modal_images/variant_view/interactions_3.png';
import variant_interactions_4 from '../script/img/modal_images/variant_view/interactions_4.png';
import variant_interactions_5 from '../script/img/modal_images/variant_view/interactions_5.png';

export const VariantViewModalContent = () => {
    return (
        <div className="modal-body-content">
            <div className="section interpretation">
                <h3>Interpretation</h3>
                <hr className="header" />
                <div className="section-content">
                    <div className="block with-image">
                        <img src={variant_interpretation_1} alt="Variant View tracks." />
                        <div className="text">
                            <p>
                                A structural variant &#40;SV&#41; may leave a footprint on the copy number profile and
                                may perturb genes.
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
                        <img src={variant_interactions_1} alt="Black vertical line above Variant View tracks." />
                        <div className="text">
                            <p>
                                <b>The black vertical line</b> indicates region in focus.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img
                            src={variant_interactions_2}
                            alt="Structural Variant detail pop up in Structural Variant track."
                        />
                        <div className="text">
                            <p>
                                <b>Hover</b> - over a structural variant to see detailed information.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img
                            src={variant_interactions_3}
                            alt="Structural Variant highlighted in Structural Variant track."
                        />
                        <div className="text">
                            <p>
                                <b>Click</b> - on a structural variant to show its breakpoints in the Read View.
                            </p>
                            <p>The positions of breakpoints are highlighted by dashed, vertical lines.</p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img src={variant_interactions_4} alt="Zoom in and out buttons." />
                        <div className="text">
                            <p>
                                <b>Zoom in and out</b> - on chromosomal regions by clicking the{' '}
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
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img src={variant_interactions_5} alt="Pan left and right buttons." />
                        <div className="text">
                            <p>
                                <b>Pan left and right</b> - around the current region by clicking the{' '}
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
                </div>
            </div>
        </div>
    );
};

export const VariantViewModal: React.FC = () => {
    return (
        <div
            className="modal fade"
            id="variant-view-modal"
            tabIndex={-1}
            aria-labelledby="Variant View Instruction Modal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Variant View Instructions
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <VariantViewModalContent />
                    </div>
                </div>
            </div>
        </div>
    );
};
