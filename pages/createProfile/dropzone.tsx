import { useRef } from "react";
import { Text, Group, Button, createStyles } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
    width: "12rem",
    height: "12rem",
    borderRadius: "15%",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    bottom: -20,
  },
}));

export function DropzoneButton(props) {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => console.log("accepted files", files)}
        radius="md"
        accept={[MIME_TYPES]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: "none" }}>
          <Text align="center" weight={500} size="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Pictures/GIFs less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>{props.name}</Dropzone.Idle>
          </Text>
        </div>
      </Dropzone>
    </div>
  );
}
