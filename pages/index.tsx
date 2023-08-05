import {
  Box,
  Text,
  Button,
  Center,
  Flex,
  Image,
  Modal,
  Title,
  useMantineTheme,
  TextInput,
} from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

interface SessionUser {
  name: string;
  image: string;
  email: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

async function handleInsertTOdb(sessionUser: SessionUser) {
  const { error } = await supabase.from("user_data").insert({
    name: sessionUser.name,
    image: sessionUser.image,
    email: sessionUser.email,
  });

  if (error) {
    console.error("Error inserting user data into database:", error);
  }
}

async function getUserFromDB(email: string): Promise<SessionUser | null> {
  const { data, error } = await supabase
    .from("user_data")
    .select()
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }

  return data;
}

export default function IndexPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<SessionUser | null>(null);
  const [loginpage, setLoginpage] = useState(false);
  const [value, setValue] = useState("");
  const [wrongemail, setWrongemail] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const theme = useMantineTheme();

  function handleLogin() {
    setLoginpage(true);
  }
  function handleLoginTouser(value: string) {
    getUserFromDB(value).then((userDataFromDB) => {
      if (!userDataFromDB) {
        // alert(`No such user found with the username ${value}`);
        setWrongemail(true);
      } else {
        setLoginpage(false);
        setUserData(userDataFromDB);
      }
    });
  }

  useEffect(() => {
    if (session?.user) {
      const { name, image, email } = session.user;
      const sessionUser: SessionUser = {
        name: name ?? "",
        image: image ?? "",
        email: email ?? "",
      };

      setUserData(sessionUser);

      if (email) {
        getUserFromDB(email).then((userDataFromDB) => {
          if (!userDataFromDB) {
            handleInsertTOdb(sessionUser);
          }
        });
      }
    }
  }, [session]);

  if (session?.user) {
    return (
      <Center mt={400}>
        <Flex
          gap='md'
          justify='center'
          align='center'
          direction='column'
          wrap='wrap'>
          <Box>
            <Image
              src={session.user.image}
              radius={25}
              alt='kenda'
              width={150}
              height={150}
            />
          </Box>
          <Title order={2}>{session.user.name}</Title>
          <Button
            uppercase
            onClick={() => signOut()}
            radius={"lg"}
            variant='light'
            size='xl'>
            Signout
          </Button>
        </Flex>
      </Center>
    );
  }

  if (userData) {
    return (
      <Center mt={400}>
        <Flex
          gap='md'
          justify='center'
          align='center'
          direction='column'
          wrap='wrap'>
          <Box>
            <Image
              src={userData.image}
              radius={25}
              alt='kenda'
              width={150}
              height={150}
            />
          </Box>
          <Title order={2}>{userData.name}</Title>
          <Button
            uppercase
            onClick={() => signOut()}
            radius={"lg"}
            variant='light'
            size='xl'>
            Signout
          </Button>
        </Flex>
      </Center>
    );
  }

  return (
    <>
      <Center mt={500}>
        {loginpage ? (
          <Flex
            gap='md'
            justify='center'
            align='center'
            direction='column'
            wrap='wrap'>
            <TextInput
              w={500}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder='example@gmail.com'
              label='email'
              radius='lg'
              size='lg'
              withAsterisk
            />

            <Modal
              radius={20}
              opened={opened}
              onClose={close}
              title='Discord Auth'
              fullScreen={isMobile}
              transitionProps={{ transition: "fade", duration: 200 }}
              overlayProps={{
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
              }}
              styles={(theme) => ({
                header: { backgroundColor: "black" },
                body: { backgroundColor: "black" },
              })}
              centered>
              Enter the email
            </Modal>
            <Button
              mx={25}
              radius={"lg"}
              variant='light'
              size='xl'
              onClick={() => {
                value ? handleLoginTouser(value) : open();
              }}>
              Login
            </Button>
            {wrongemail ? (
              <>
                <Text c={"red"}>
                  Sorry, your email was incorrect. Please double-check your
                  email.
                </Text>
              </>
            ) : (
              <></>
            )}
          </Flex>
        ) : (
          <>
            <Button
              mx={25}
              radius={"lg"}
              variant='light'
              size='xl'
              onClick={() => handleLogin()}>
              Login
            </Button>
            <Button
              radius={"lg"}
              variant='light'
              size='xl'
              onClick={() => signIn()}>
              Sign in
            </Button>
          </>
        )}
      </Center>
    </>
  );
}
