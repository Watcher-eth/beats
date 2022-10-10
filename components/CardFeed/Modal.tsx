import { LayoutGroup, motion } from "framer-motion";
import React, { useState } from "react";

function ToggleContent({ header, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div layout onClick={() => setIsOpen(!isOpen)}>
      <motion.h2 layout>{header}</motion.h2>
      {isOpen ? content : null}
    </motion.div>
  );
}

export default function Modal(header, content) {
  return (
    <>
      <ToggleContent header={header} content={content} />
      <ToggleContent header={header} content={content} />
    </>
  );
}
