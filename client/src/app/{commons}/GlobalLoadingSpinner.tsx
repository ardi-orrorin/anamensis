import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

const GlobalLoadingSpinner = () => {
    return (
        <div className="min-w-full min-h-screen flex justify-center items-center opacity-25">
            <LoadingSpinner size={80} />
        </div>
    );
}

export default GlobalLoadingSpinner;