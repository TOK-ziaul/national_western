import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import Dropdown from "./ui/Dropdown";
import { IoMdArrowRoundBack } from "react-icons/io";

const schema = yup.object({
  searchTerm: yup.string().required("Search term is required"),
  filterValue: yup.string().required("Filter is required"),
});

const BrickPlacementHeader = ({
  onSearch,
  onFilterChange,
  searchContext,
  handleGoBack,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      searchTerm: searchContext?.value || "",
      filterValue: searchContext?.filter || "",
    },
  });

  // Update form values when searchContext changes
  useEffect(() => {
    if (searchContext) {
      reset({
        searchTerm: searchContext.value || "",
        filterValue: searchContext.filter || "",
      });
    }
  }, [searchContext, reset]);

  const onSubmitHandler = (data) => {
    onSearch(data.searchTerm, data.filterValue);
  };

  const handleFilterChange = (option) => {
    const value = option.value;
    setValue("filterValue", value);
    onFilterChange(value);
    // Trigger form validation
    handleSubmit(onSubmitHandler)();
  };

  // Dropdown options matching the original select
  const filterOptions = [
    { value: "FIRSTNAME", label: "First Name" },
    { value: "LASTNAME", label: "Last Name" },
    { value: "INSCRIPTION", label: "Inscription" },
  ];

  return (
    <div className="bg-white md:px-6 px-4 pt-4 flex flex-col md:flex-row justify-between border-b border-gray-200">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleGoBack}
          className="flex gap-2 items-center bg-navy-blue text-white rounded-full p-2 text-xl"
        >
          <IoMdArrowRoundBack />
        </button>
        <h1 className="md:text-[2rem] text-2xl font-gin-test mb-2">
          NWSS BRICK PLACEMENT SEARCH
        </h1>
      </div>

      {/* Search Controls */}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex items-end  justify-between md:justify-end"
      >
        {/* Filter Dropdown with Label */}
        <div className="flex items-center space-x-2">
          <Dropdown
            options={filterOptions}
            selectedValue={watch("filterValue")}
            onSelect={handleFilterChange}
            className=" md:text-[1.4rem] text-lg"
          />
        </div>

        {/* Search Input with Icon */}
        <div className="relative ">
          <input
            {...register("searchTerm")}
            type="text"
            placeholder="Search"
            className={` pr-8 pl-3 pt-[0.4rem] pb-[9px] border rounded-t-md  text-gray-700 md:text-[1.4rem] text-lg focus:outline-none !bg-transparent w-48 ${
              errors.searchTerm ? " border-red-600 " : "  border-gray-300/70"
            }`}
          />
          <button
            type="submit"
            className=" text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <IoSearch className="w-6 h-6 text-navy-blue" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrickPlacementHeader;
