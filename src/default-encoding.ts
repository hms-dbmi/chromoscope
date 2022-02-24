export default {
    color: {
        svclass: {
            // definitions about head-to-head and tail-to-tail inversion,
            // see https://genomebiology.biomedcentral.com/articles/10.1186/s13059-018-1421-5/figures/7
            domain: ['Translocation', 'Duplication', 'Deletion', 'Inversion (TtT)', 'Inversion (HtH)'],
            range: ['lightgrey', '#409F7A', '#3275B4', '#CC7DAA', '#E6A01B'],
            Translocation: 'lightgrey',
            Duplication: '#409F7A',
            Deletion: '#3275B4',
            'Inversion (TtT)': '#CC7DAA',
            'Inversion (HtH)': '#E6A01B'
        }
    }
};
