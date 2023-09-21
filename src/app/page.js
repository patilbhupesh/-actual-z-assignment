"use client";
import DataGridTable from "@/components/DataGridTable";
import ProgressBar from "@/components/ProgressBar";
import { BASE_URLS, URLS } from "@/constants/urls";
import axios from "axios";
import { useEffect, useState } from "react";
import { read, utils } from "xlsx";
export default function Home() {
  const [xlsxFile, setXlsxFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [excelData, setExcelData] = useState(null);
  const [sheetName, setSheetName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    axios
      .get(BASE_URLS + URLS.GET_FILES + `?pageSize=10`)
      .then((response) => {
        console.log("response", response.data);
        setExcelData(response?.data?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [excelData]);
  const handleInputFile = (event) => {
    event.preventDefault();
    let allowFileTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    let selectedFile = event.target?.files[0];
    if (selectedFile) {
      if (selectedFile && allowFileTypes.includes(selectedFile?.type)) {
        setErrorMessage(null);
        let fileReader = new FileReader();

        fileReader.readAsArrayBuffer(selectedFile);
        fileReader.onload = (eventOnload) => {
          setXlsxFile(eventOnload.target.result);
        };
      } else {
        setErrorMessage("Please select file with .xlsx extention");
        setXlsxFile(null);
      }
    } else {
      setErrorMessage("Please select your file...!");
      setXlsxFile(null);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (xlsxFile !== null && xlsxFile) {
      const excelWorkBook = read(xlsxFile, { type: "buffer" });
      const worksheetName = excelWorkBook.SheetNames[0];
      setSheetName(worksheetName);
      const worksheet = excelWorkBook.Sheets[worksheetName];
      const data = utils.sheet_to_json(worksheet);

      let payload = {
        fileBody: JSON.stringify(data),
      };

      try {
        const response = await axios.post(
          BASE_URLS + URLS.FILE_UPLOAD,
          payload,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
      } catch (error) {
        setErrorMessage("File to upload file");
      }
    } else {
      setErrorMessage("Please select file with .xlsx extention");
      setXlsxFile(null);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-10">
      <div className=" w-[600px] text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form
          className="p-8 flex flex-col  justify-center items-start"
          onSubmit={handleFileUpload}
        >
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Upload file excel file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handleInputFile}
          />

          {errorMessage && (
            <div
              className="p-4 w-full mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5"
          >
            Upload File
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
          {sheetName && (
            <p
              className="mt-4 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              Display Sheet Name :{" "}
              <span className="font-bold">{sheetName}</span>
            </p>
          )}
        </form>

        {uploadProgress > 0 && !errorMessage && (
          <ProgressBar uploadProgress={uploadProgress} />
        )}
      </div>

      {excelData && <DataGridTable excelData={excelData} />}
    </main>
  );
}
