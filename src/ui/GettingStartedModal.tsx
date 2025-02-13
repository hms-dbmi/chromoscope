import React from 'react';

import genome_interactions_1 from '../script/img/modal_images/genome_view/interactions_1.png';
import genome_interactions_2 from '../script/img/modal_images/genome_view/interactions_2.png';
import genome_interactions_3 from '../script/img/modal_images/genome_view/interactions_3.png';
import genome_interactions_4 from '../script/img/modal_images/genome_view/interactions_4.png';

export const GettingStartedModalContent: React.FC = () => {
    return (
        <div className="modal-body-content">
            <div className="section interactions">
                <h3>Interactions</h3>
                <hr className="header" />
                <div className="section-content">
                    <div className="block with-image">
                        <img src={genome_interactions_1} alt="Grab cursor over blue, selected region in Genome View." />
                        <div className="text">
                            <p>
                                <b>Click and drag</b> - the blue selection brush to highlight regions of the genome.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img
                            src={genome_interactions_2}
                            alt="Move cursor over edge of blue, selected region in Genome View."
                        />
                        <div className="text">
                            <p>
                                <b>Click and drag</b> - the edges of the selection brush to resize it.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img src={genome_interactions_3} alt="Structural Variant detail pop up in Genome View." />
                        <div className="text">
                            <p>
                                <b>Hover</b> - over a structural variant to see detailed information.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="block with-image">
                        <img src={genome_interactions_4} alt="Highlighted structural variant strand in Genome View." />
                        <div className="text">
                            <p>
                                <b>Click</b> - on a structural variant to inspect breakpoints in other views.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
