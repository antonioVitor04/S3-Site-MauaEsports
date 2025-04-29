const PageBanner = ({ pageName }) => {
    return (
        <h1 className="pb-15 pt-5 mb-5 text-xl sm:text-3xl font-bold text-center bg-[#010409] text-white">
            {pageName}
        </h1>
    );
};

export default PageBanner;