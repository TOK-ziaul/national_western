import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

export default function ResultsTable({
  results,
  onDonorClick,
  isSimilarResults = false,
}) {
  return (
    <div
      className={`mt-2 h-[12rem]  ${
        results.length > 2 ? "overflow-y-scroll" : "overflow-y-auto"
      }`}
    >
      {results.length > 0 ? (
        <>
          {isSimilarResults && (
            <div className="bg-navy-blue/10 border-l-4 border-navy-blue p-3 ">
              <div className="flex">
                <div className="ml-2">
                  <p className="text-lg text-navy-blue">
                    <strong>Similar Results:</strong> No exact matches found.
                    Showing similar donors based on your search criteria.
                  </p>
                </div>
              </div>
            </div>
          )}
          <table className="w-full">
            <tbody>
              {results.map((r, i) => {
                const isBothInscriptions = r.inscription && r.inscription2;

                return (
                  <tr
                    onClick={() => onDonorClick && onDonorClick(r)}
                    key={i}
                    className={`hover:bg-gray-50 border-b text-navy-blue font-medium md:text-2xl text-lg flex justify-between py-1 md:px-4 px-2 cursor-pointer ${
                      isSimilarResults ? "opacity-90" : ""
                    }`}
                  >
                    <td className="p-2 flex items-start gap-2">
                      <span className="text-navy-blue font-medium  me-4">
                        {i + 1}.
                      </span>
                      <div>
                        <button className="text-navy-blue hover:text-blue-600   transition-colors">
                          {r.firstName} {r.lastName}
                        </button>
                        <div
                          className={`w-fit flex flex-col gap-1.5 ${
                            isBothInscriptions ? "h-[4rem]" : "h-[2rem]"
                          } overflow-hidden transition-all duration-500 text-base md:!text-xl`}
                        >
                          {r.inscription && (
                            <span>
                              {!isBothInscriptions
                                ? "Inscription: "
                                : "Inscription 1: "}
                              {r.inscription.slice(0, 50)}
                            </span>
                          )}
                          {r.inscription2 && (
                            <span>
                              {" "}
                              {!isBothInscriptions
                                ? "Inscription: "
                                : "Inscription 2: "}
                              {r.inscription2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 ">
                      {r.row && r.col ? (
                        <>
                          Row {r.row}, Col {r.col}
                        </>
                      ) : (
                        <span className="text-gray-500">
                          No brick placement
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <div className="text-center text-2xl font-medium text-navy-blue h-full flex items-center justify-center">
          No results found
        </div>
      )}
    </div>
  );
}
