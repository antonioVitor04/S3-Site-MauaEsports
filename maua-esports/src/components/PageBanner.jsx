import PropTypes from 'prop-types';

const PageBanner = ({ pageName }) => {
    return (
        <h1 className="pb-15 text-xl sm:text-3xl font-bold text-center bg-[#010409] text-white">
            {pageName}
        </h1>
    );
};

PageBanner.propTypes = {
    pageName: PropTypes.string.isRequired
};

export default PageBanner;