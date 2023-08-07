import {
  Box,
  Text,
  Button,
  Center,
  Flex,
  Image,
  Title,
  useMantineTheme,
  TextInput,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession, signIn, signOut } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBrandDiscordFilled, IconBrandTelegram } from "@tabler/icons-react";
import HeaderComp from "./components/Header";

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

export default function Home() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<SessionUser | null>(null);
  const [loginpage, setLoginpage] = useState(false);
  const [value, setValue] = useState("");
  const [wrongemail, setWrongemail] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  function handleLogin() {
    setLoginpage(true);
  }
  function handleLoginTouser(value: any) {
    getUserFromDB(value.email).then((userDataFromDB) => {
      if (!userDataFromDB) {
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
              alt={`${session.user.name}`}
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
      <Center mt={100}>
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
            radius='md'
            variant='light'
            size='md'>
            Signout
          </Button>
        </Flex>
      </Center>
    );
  }

  return (
    <>
      <HeaderComp></HeaderComp>
      <Center mt={isMobile ? 100 : 200}>
        {loginpage ? (
          <>
            <Flex
              gap='md'
              mx={10}
              direction='column'
              wrap='wrap'>
              <div>
                <Group position='right'>
                  <Button
                    onClick={() => setLoginpage(false)}
                    variant='light'
                    radius='md'
                    size='md'>
                    Back
                  </Button>
                </Group>
              </div>
              <form
                onSubmit={form.onSubmit((values) => handleLoginTouser(values))}>
                <TextInput
                  w={isMobile ? 350 : 500}
                  placeholder='example@gmail.com'
                  label='email'
                  radius='lg'
                  size='md'
                  withAsterisk
                  {...form.getInputProps("email")}
                />
                {wrongemail ? (
                  <Text
                    mt={5}
                    c={"red"}>
                    Check wether entered email address is correct or Signed in ?
                  </Text>
                ) : (
                  <></>
                )}
                <Group
                  position='center'
                  mt={"md"}>
                  <Button
                    type='submit'
                    radius={"lg"}
                    variant='light'
                    size='md'
                    leftIcon={<IconBrandTelegram size='1.2rem' />}>
                    Login
                  </Button>
                </Group>
              </form>

              {wrongemail ? (
                <>
                  <Text ta={"center"}>
                    Not Signed in ?, Sign up by clicking the signup button
                  </Text>
                  <Button
                    mx={25}
                    radius={"lg"}
                    variant='light'
                    size='md'
                    leftIcon={<IconBrandDiscordFilled size='1.2rem' />}
                    onClick={() => signIn()}>
                    Sign up
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Flex>
          </>
        ) : (
          <Group>
            <Button
              radius={"lg"}
              variant='light'
              size='lg'
              // leftIcon={<IconBrandDiscordFilled size='1.2rem' />}
              uppercase
              onClick={() => handleLogin()}>
              Login
            </Button>
            <Button
              radius={"lg"}
              variant='light'
              size='lg'
              leftIcon={<IconBrandDiscordFilled size='1.2rem' />}
              uppercase
              onClick={() => signIn("discord")}>
              Sign in
            </Button>
          </Group>
        )}
      </Center>
    </>
  );
}
