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
              {results.map((r, i) => (
                <tr
                  onClick={() => onDonorClick && onDonorClick(r)}
                  key={i}
                  className={`hover:bg-gray-50 border-b text-navy-blue font-medium md:text-2xl text-lg flex items-center justify-between py-2 md:px-4 px-2 cursor-pointer ${
                    isSimilarResults ? "opacity-90" : ""
                  }`}
                >
                  <td className="p-2 ">
                    <span className="text-navy-blue font-medium  me-4">
                      {i + 1}
                    </span>
                    <button className="text-navy-blue hover:text-blue-600   transition-colors">
                      {r.firstName} {r.lastName}
                    </button>
                  </td>
                  <td className="p-2 ">
                    {r.row && r.col ? (
                      <>
                        Row {r.row}, Col {r.col}
                      </>
                    ) : (
                      <span className="text-gray-500">No brick placement</span>
                    )}
                  </td>
                </tr>
              ))}
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
