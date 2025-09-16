import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "./ui/Header";

const schema = yup
  .object({
    firstName: yup.string(),
    lastName: yup.string(),
    inscription: yup.string(),
  })
  .test("at-least-one", "Please fill in at least one field", function (value) {
    const hasValue =
      value.firstName?.trim() ||
      value.lastName?.trim() ||
      value.inscription?.trim();
    return hasValue;
  });

const LegacySearchForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data) => {
    console.log("Search data:", data);
    onSubmit(data);
  };

  const inputClassName = (hasError = false) =>
    `w-full px-6 py-[0.9rem] rounded-2xl border-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-blue focus:border-transparent text-2xl font-medium ${
      hasError ? "ring-2 ring-red-500" : ""
    }`;

  return (
    <div className="xl:max-w-3xl mx-auto px-8 py-8 md:px-12 md:py-12 ">
      <h3 className="text-black text-[1.5rem] md:text-[1.5rem] lg:text-[1.8rem] mb-8 tracking-wide font-gin-test">
        FILL IN THE DETAILS USING ANY ONE OF THE THREE OPTIONS.
      </h3>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-y-8 gap-y-6 ">
          {/* First Name */}
          <div>
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              className={inputClassName(!!(errors.root || errors[""]))}
            />
          </div>

          {/* Last Name */}
          <div>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              className={inputClassName(!!(errors.root || errors[""]))}
            />
          </div>
          <div>
            <input
              {...register("inscription")}
              type="text"
              placeholder="Inscription"
              className={inputClassName(!!(errors.root || errors[""]))}
            />
          </div>
        </div>

        {/* Inscription */}

        {/* Error Message */}
        {(errors.root || errors[""]) && (
          <div className="text-red-600 text-sm font-medium text-center">
            {errors.root?.message || errors[""]?.message}
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center ">
          <button
            type="submit"
            className="bg-navy-blue hover:bg-navy-blue/90 hover:shadow-lg text-white font-semibold py-4  rounded-xl transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy-blue focus:ring-opacity-50 text-[1.4rem] md:w-[40%] w-full"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default LegacySearchForm;
