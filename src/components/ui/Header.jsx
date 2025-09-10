const Header = () => {
  return (
    <div className="bg-navy-blue text-white flex justify-between items-center">
      <div className="h-full ">
        <img
          src="/nwLogo.svg"
          alt="logo"
          // width={100}
          // height={100}
          className="w-[70%] sm:w-[80%] md:w-[80%] lg:w-full me-auto"
        />
      </div>
      <div className="h-full x !w-fit">
        <img
          src="/legacyLogo.svg"
          alt="logo"
          // width={100}
          className="w-[70%] sm:w-[80%]  md:w-[80%] lg:w-full ms-auto"
          // height={100}
        />
      </div>
    </div>
  );
};

export default Header;
