import {
  createStyles,
  Header,
  Group,
  Button,
  Divider,
  Text,
  Box,
  Burger,
  Drawer,
  Image,
  ScrollArea,
  rem,
  Modal,
  Flex,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { IconBrandDiscordFilled, IconBrandTelegram } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface userData {
  email?: string | null;
  image?: string | null;
  name?: string | null;
  loggedin?: boolean | null;
}

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "30px",
    borderRadius: 10,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 700,
    fontSize: theme.fontSizes.md,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    }),

    "&:active": theme.activeStyles,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

const links = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Store",
    link: "store",
  },
];

export default function HeaderComp() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(links[0].link);
  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={() => {
        setActive(link.link);
      }}>
      {link.label}
    </Link>
  ));

  // auth
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [loginpage, setLoginpage] = useState(false);
  const [wrongemail, setWrongemail] = useState(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const [localuserdata, setLocalUserData] = useLocalStorage<userData | null>({
    key: "UserData",
  });

  function handleLogin() {
    setLoginpage(true);
  }

  useEffect(() => {
    console.log("Local user data updated:", localuserdata);
  }, [localuserdata]);

  function handleLoginTouser(values: { email: string }) {
    if (values.email === localuserdata?.email) {
      setLocalUserData({
        email: localuserdata.email,
        image: localuserdata.image,
        name: localuserdata.name,
        loggedin: true,
      });
      close();
      setLoginpage(false);
    } else {
      setWrongemail(true);
    }
  }
  useEffect(() => {
    if (session?.user) {
      setLocalUserData({
        email: session.user.email,
        image: session.user.image,
        name: session.user.name,
        loggedin: true,
      });
    }
  }, [session]);

  // end of auth functions

  return (
    <>
      <Box>
        <Header
          bg={"#140b0e"}
          // mb={25}
          height='auto'
          px='md'>
          <Group
            position='apart'
            sx={{ height: "100%" }}>
            <Image
              src={"logo.png"}
              alt='SY_Dev'
              width={70}
              height={70}
            />

            <Group
              sx={{ height: "100%" }}
              spacing={5}
              className={classes.hiddenMobile}>
              {items}
            </Group>

            {localuserdata?.loggedin ? (
              <Group className={classes.hiddenMobile}>
                <Image
                  src={localuserdata.image}
                  radius={25}
                  alt='kenda'
                  width={50}
                  height={50}
                />
                <Button
                  onClick={() => {
                    signOut(),
                      setLocalUserData({
                        email: localuserdata.email,
                        image: localuserdata.image,
                        name: localuserdata.name,
                        loggedin: false,
                      });
                  }}
                  radius='sm'
                  variant='light'
                  size='sm'>
                  Log out
                </Button>
              </Group>
            ) : (
              <Group className={classes.hiddenMobile}>
                <Button
                  variant='light'
                  onClick={open}>
                  Log in
                </Button>
                <Button onClick={() => signIn("discord")}>Sign up</Button>
              </Group>
            )}
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </Group>
        </Header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size='100%'
          padding='md'
          title='SY_Dev'
          className={classes.hiddenDesktop}
          zIndex={1000000}>
          <ScrollArea
            h={`calc(100vh - ${rem(60)})`}
            mx='-md'>
            <Divider
              my='sm'
              color={"dark.1"}
            />
            <Link
              href='/'
              className={classes.link}>
              Home
            </Link>

            <Link
              href='storage'
              className={classes.link}>
              Storage
            </Link>

            <Divider
              my='sm'
              color={"dark.1"}
            />

            {localuserdata?.loggedin ? (
              <Group position='center'>
                <Image
                  src={localuserdata.image}
                  radius={25}
                  alt='kenda'
                  width={50}
                  height={50}
                />
                <Button
                  onClick={() => {
                    signOut(),
                      setLocalUserData({
                        email: localuserdata.email,
                        image: localuserdata.image,
                        name: localuserdata.name,
                        loggedin: false,
                      });
                  }}
                  radius='sm'
                  variant='light'
                  size='sm'>
                  Log out
                </Button>
              </Group>
            ) : (
              <Group
                position='center'
                grow
                pb='xl'
                px='md'>
                <Button variant='default'>Log in</Button>
                <Button onClick={() => signIn("discord")}>Sign up</Button>
              </Group>
            )}
          </ScrollArea>
        </Drawer>
      </Box>
      <Modal
        size='auto'
        opened={opened}
        onClose={close}
        title='Log In'
        centered>
        <Flex
          gap='md'
          mx={10}
          direction='column'
          wrap='wrap'>
          <form onSubmit={form.onSubmit((values) => handleLoginTouser(values))}>
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
      </Modal>
    </>
  );
}
