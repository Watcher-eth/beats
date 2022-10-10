import React from "react";
import { Spinner } from "@chakra-ui/react";

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="animate-bounce">
        <Spinner />
      </div>
    </div>
  );
};

export default FullPageLoader;
