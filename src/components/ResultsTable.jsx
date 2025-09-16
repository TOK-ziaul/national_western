export default function ResultsTable({ results }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">#</th>
            <th className="p-2 border text-left">Name</th>
            <th className="p-2 border text-left">Inscription</th>
            <th className="p-2 border text-left">Position</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">
                {r.firstName} {r.lastName}
              </td>
              <td className="p-2 border">{r.inscription}</td>
              <td className="p-2 border">
                Row {r.row}, Col {r.col}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
