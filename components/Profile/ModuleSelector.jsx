import {
  Radio,
  RadioGroup,
  Box,
  HStack,
  Text,
  color,
  Image,
} from "@chakra-ui/react";
import { useRadio, useRadioGroup } from "@chakra-ui/react";

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        margin={"1rem"}
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "grey.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={50}
        py={20}
      >
        
        {props.children}
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
export default function ModuleSelector() {
  const options = ["🎉Free", "💸Paid", "🌊Flow"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "react",
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            <Box bgImage={"https://soundcloud.com/danielallantunes"}>
              <Text fontSize={"25px"}>{value}</Text>
            </Box>
          </RadioCard>
        );
      })}
    </HStack>
  );
}
