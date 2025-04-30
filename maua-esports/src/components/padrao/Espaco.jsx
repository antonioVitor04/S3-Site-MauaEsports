import PropTypes from 'prop-types';

const Espaco = ({ tamanho }) => {
    return <div style={{ height: tamanho, width: '100%' }} />;
};

Espaco.propTypes = {
    tamanho: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

export default Espaco;