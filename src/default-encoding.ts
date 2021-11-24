export default {
    color: {
        svclass: {
            // definitions about head-to-head and tail-to-tail inversion,
            // see https://genomebiology.biomedcentral.com/articles/10.1186/s13059-018-1421-5/figures/7
            // domain: ['DUP', 'TRA', 'DEL', 't2tlNV', 'h2hlNV'],
            domain: ['Duplication', 'Translocation', 'Deletion', 'Inversion (TtT)', 'Inversion (HtH)'],
            range: ['#569C4D', '#4C75A2', '#DA5456', '#EA8A2A', '#ECC949'],
            'duplication (-+)': '#569C4D',
            'translocation (-+)': '#4C75A2',
            'deletion (+-)': '#DA5456',
            'inversion (++)': '#EA8A2A',
            'inversion (--)': 'ECC949'
        }
    }
};
