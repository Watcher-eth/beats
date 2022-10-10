import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputRightAddon,
  InputGroup,
  Textarea,
  Button,
  Flex,
} from "@chakra-ui/react";
import { DropzoneButton } from "./dropzone";

import ModuleSelector from "./ModuleSelector";

function ProfileFeed() {
  return (
    <>
      <FormControl isRequired>
        <DropzoneButton />
        <FormLabel>Choose your handle</FormLabel>

        <InputGroup>
          <Input type="text" placeholder="yourHandle" />
          <InputRightAddon children=".lens" />
        </InputGroup>
      </FormControl>
      <FormControl paddingTop={"1rem"}>
        <FormLabel>Write a description</FormLabel>
        <Textarea placeholder="Anon exploring the vast frontiers of the dentralized internet..." />
      </FormControl>
      <FormControl paddingTop={"1rem"}>
        <FormLabel>Choose Follow Module</FormLabel>
        <ModuleSelector />
      </FormControl>
      <Button w="13rem" margin={"1rem"} h="2.7rem" alignSelf={"center"}>
        Submit
      </Button>
    </>
  );
}
export default ProfileFeed;
