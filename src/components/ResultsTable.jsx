export default function ResultsTable({ results, onDonorClick }) {
  return (
    <div className="mt-2 h-[12rem] overflow-y-auto ">
      {results.length > 0 ? (
        <table className="w-full">
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 border-b text-navy-blue font-medium md:text-2xl text-lg flex items-center justify-between py-2 md:px-4 px-2"
              >
                <td className="p-2 ">
                  <span className="text-navy-blue font-medium  me-4">
                    {i + 1}
                  </span>
                  <button
                    onClick={() => onDonorClick && onDonorClick(r)}
                    className="text-navy-blue hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                  >
                    {r.firstName} {r.lastName}
                  </button>
                </td>
                <td className="p-2 ">
                  Row {r.row}, Col {r.col}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-2xl font-medium text-navy-blue h-full flex items-center justify-center">
          No results found
        </div>
      )}
    </div>
  );
}
