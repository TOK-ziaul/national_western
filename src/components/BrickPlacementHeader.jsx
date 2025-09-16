import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  searchTerm: yup.string().required("Search term is required"),
  filterValue: yup.string().required("Filter is required"),
});

const BrickPlacementHeader = ({ onSearch, onFilterChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      searchTerm: "",
      filterValue: "ALL",
    },
  });

  const watchedFilterValue = watch("filterValue");

  const onSubmitHandler = (data) => {
    console.log("Header search data:", data);
    onSearch(data.searchTerm, data.filterValue);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    onFilterChange(value);
  };

  return (
    <div className="bg-gray-100 px-6 pt-4 flex items-center justify-between border-b border-gray-200">
      {/* Title */}
      <h1 className="text-3xl font-gin-test mb-2">
        NWSS BRICK PLACEMENT SEARCH
      </h1>

      {/* Search Controls */}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex items-center space-x-3"
      >
        {/* Filter Dropdown with Label */}
        <div className="flex items-center space-x-2">
          <select
            {...register("filterValue")}
            onChange={(e) => {
              handleFilterChange(e);
              // Trigger form validation
              handleSubmit(onSubmitHandler)();
            }}
            className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 text-sm focus:outline-none focus:ring-none"
          >
            <option value="ALL">All</option>
            <option value="FIRSTNAME">First Name</option>
            <option value="LASTNAME">Last Name</option>
            <option value="INSCRIPTION">Inscription</option>
          </select>
        </div>

        {/* Search Input with Icon */}
        <div className="relative">
          <input
            {...register("searchTerm")}
            type="text"
            placeholder="Search..."
            className={`pr-8 pl-3 py-1 border rounded bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 ${
              errors.searchTerm ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="submit"
            className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <svg
              className=""
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          {errors.searchTerm && (
            <span className="text-red-500 text-xs absolute -bottom-4 left-0">
              {errors.searchTerm.message}
            </span>
          )}
        </div>

        {/* Search Button
        <button
          type="submit"
          className="px-4 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
        >
          Search
        </button> */}
      </form>
    </div>
  );
};

export default BrickPlacementHeader;
