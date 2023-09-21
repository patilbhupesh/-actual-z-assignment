import React from "react";

const DataGridTable = ({ excelData }) => {
  return (
    <div class="flex flex-col overflow-x-auto w-full">
      <div class="sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm font-light">
              <thead class="border-b font-medium dark:border-neutral-500">
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key} scope="col" class="px-6 py-4">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((excelRowData, index) => (
                  <tr class="border-b dark:border-neutral-500" key={index}>
                    {Object.keys(excelRowData).map((key) => (
                      <td class="whitespace-nowrap px-6 py-4" key={key}>
                        {excelRowData[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGridTable;
