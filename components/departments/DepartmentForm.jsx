const DepartmentForm = ({
  formData,
  setFormData,
  editingId,
  loading,
  saveDepartment,
  cancelEditing,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDepartment(formData);
  };

  return (
    <div className="bg-white shadow rounded p-6 mb-6 border">
      <h2 className="text-xl font-medium mb-4">
        {editingId ? "Edit Department" : "Add New Department"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Department Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter department name"
            disabled={loading}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter department description"
            disabled={loading}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-3">
          {editingId && (
            <button
              type="button"
              onClick={cancelEditing}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading
              ? "Processing..."
              : editingId
              ? "Update Department"
              : "Add Department"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
