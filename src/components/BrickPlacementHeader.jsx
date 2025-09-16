import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoSearch } from "react-icons/io5";

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

  const onSubmitHandler = (data) => {
    onSearch(data.searchTerm, data.filterValue);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    onFilterChange(value);
  };

  return (
    <div className="bg-white md:px-6 px-4 pt-4 flex flex-col md:flex-row justify-between border-b border-gray-200">
      {/* Title */}
      <h1 className="md:text-3xl text-2xl font-gin-test mb-2">
        NWSS BRICK PLACEMENT SEARCH
      </h1>

      {/* Search Controls */}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex items-end  justify-between md:justify-end"
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
            className="px-2 py-[0.32rem] md:text-[1.4rem] text-lg border border-gray-300/70 rounded bg-transparent text-gray-700/60  focus:outline-none focus:ring-none"
          >
            <option value="ALL">All</option>
            <option value="FIRSTNAME">First Name</option>
            <option value="LASTNAME">Last Name</option>
            <option value="INSCRIPTION">Inscription</option>
          </select>
        </div>

        {/* Search Input with Icon */}
        <div className="relative ">
          <input
            {...register("searchTerm")}
            type="text"
            placeholder="Search"
            className={` pr-8 pl-3  py-[0.4rem]  border rounded bg-white text-gray-700 md:text-[1.4rem] text-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 ${
              errors.searchTerm ? "border-red-500" : "  border-gray-300/70"
            }`}
          />
          <button
            type="submit"
            className=" text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <IoSearch className="w-6 h-6 text-navy-blue" />
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
