const DepartmentsTable = ({
  departments,
  loading,
  startEditing,
  deleteDepartment,
}) => {
  if (loading && !departments.length) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white border rounded shadow">
        Loading departments...
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white border rounded shadow">
        <h3 className="font-medium">No departments found</h3>
        <p>Add your first department using the form above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">NAME</th>
            <th className="px-4 py-2 text-left font-semibold">DESCRIPTION</th>
            <th className="px-4 py-2 text-left font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50 border-t">
              <td className="px-4 py-3 font-medium">{dept.name}</td>
              <td className="px-4 py-3 text-gray-600">
                {dept.description || (
                  <span className="italic text-gray-400">No description</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(dept)}
                    disabled={loading}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDepartment(dept.id)}
                    disabled={loading}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentsTable;
