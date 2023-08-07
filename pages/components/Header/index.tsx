import { createStyles, Header, Title } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: "rgba(25, 113, 194, 0.2)",
  },
}));

export default function HeaderComp() {
  const { classes } = useStyles();

  return (
    <Header
      height={"auto"}
      className={classes.header}
      p={10}>
      <Title
        ta={"center"}
        c={"#a5d8ff"}
        order={1}>
        DISCORD AUTH
      </Title>
    </Header>
  );
}
