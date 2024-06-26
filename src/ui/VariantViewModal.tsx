import React from 'react';

export const VariantViewModal = () => {
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
                    <div className="modal-body"></div>
                </div>
            </div>
        </div>
    );
};
