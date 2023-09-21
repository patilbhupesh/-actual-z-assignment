import "../app/progressbar.css";

const ProgressBar = ({ uploadProgress }) => {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
            Upload Progress
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-teal-600">
            {uploadProgress}%
          </span>
        </div>
      </div>

      <div className="flex mt-1 w-full">
        <div className="flex items-center justify-center  w-full">
          <div
            className={`progress-bar bg-teal-400 w-full`}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
