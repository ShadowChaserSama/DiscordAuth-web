import { Center, Container, Title } from "@mantine/core";
import React from "react";

function Home() {
  return (
    <Container
      style={{ backgroundColor: "black", maxWidth: "100%", height: "90.9vh" }}
      p={25}>
      <Center>
        <Title>HOME</Title>
      </Center>
    </Container>
  );
}

export default Home;
