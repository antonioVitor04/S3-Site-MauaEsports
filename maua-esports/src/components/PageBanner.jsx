import PropTypes from 'prop-types';

const PageBanner = ({ pageName }) => {
    return (
        <h1 className="h-24 flex items-center justify-center text-xl sm:text-1xl font-bold bg-[#010409] text-white">
            {pageName}
        </h1>
    );
};

PageBanner.propTypes = {
    pageName: PropTypes.string.isRequired
};

export default PageBanner;