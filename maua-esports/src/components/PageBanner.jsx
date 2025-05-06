import PropTypes from 'prop-types';

const PageBanner = ({ pageName }) => {
    return (
        <h1 className="h-24 flex items-center justify-center text-xl sm:text-3xl font-bold bg-[#010409] text-white pb-15">
            {pageName}
        </h1>
    );
};

PageBanner.propTypes = {
    pageName: PropTypes.string.isRequired
};

export default PageBanner;