import React from "react";

type Props = {};

const Header: React.FC<Props> = () => {
  return (
    <>
      <div className="sticky top-2 z-10 flex h-14 flex-shrink-0 bg-[#F7F8FA] rounded-xl">
        <button
          type="button"
          className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          
        </button>
        <div className="flex flex-1 justify-end px-4">
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              
            </button>
            {/* Profile */}
            <div className="relative ml-3">
              <div className="flex gap-x-3 items-center">
                <p className="text-[#DADADA]">
                 
                </p>
                <button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://marketplace.canva.com/EAFqNrAJpQs/1/0/1600w/canva-neutral-pink-modern-circle-shape-linkedin-profile-picture-WAhofEY5L1U.jpg"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
