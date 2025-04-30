import PropTypes from 'prop-types';

const Margin = ({ 
    children, 
    all,         // margem para todos os lados
    top,         // margem superior
    right,       // margem direita
    bottom,      // margem inferior
    left,        // margem esquerda
    horizontal,  // margem horizontal (esquerda e direita)
    vertical,    // margem vertical (topo e inferior)
    ...props 
}) => {
    const style = {};
    
    // Aplica margem única para todos os lados se 'all' for especificado
    if (all !== undefined) {
        style.margin = all;
    }
    
    // Aplica margens horizontais e verticais se especificadas
    if (horizontal !== undefined) {
        style.marginLeft = horizontal;
        style.marginRight = horizontal;
    }
    
    if (vertical !== undefined) {
        style.marginTop = vertical;
        style.marginBottom = vertical;
    }
    
    // Sobrescreve com margens específicas para cada lado, se fornecidas
    if (top !== undefined) style.marginTop = top;
    if (right !== undefined) style.marginRight = right;
    if (bottom !== undefined) style.marginBottom = bottom;
    if (left !== undefined) style.marginLeft = left;

    return (
        <div style={style} {...props}>
            {children}
        </div>
    );
};

Margin.propTypes = {
    children: PropTypes.node.isRequired,
    all: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horizontal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vertical: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Margin.defaultProps = {
    all: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
    left: undefined,
    horizontal: undefined,
    vertical: undefined,
};

export default Margin;