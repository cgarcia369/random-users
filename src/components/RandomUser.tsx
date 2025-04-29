import { Button, Center, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import { useLocalStorage } from "react-use";
import { useEffect, useMemo, useState } from "react";
import { animate, useMotionValue, motion, useTransform } from "framer-motion";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import HistoricUsers from "./HistoricUsers.tsx";
import SoundRoulette from "../assets/sound.mp3";
type RandomUserProps = {
  users: {
    name: string;
    company: string;
  }[];
};
const DurationTime = 4;
const RandomUser = ({ users }: RandomUserProps) => {
  const [usersRemoved, setUsersRemoved] = useLocalStorage<number[]>("usersRemoved", []);
  const [usersPlayed, setUsersPlayed] = useLocalStorage<
    {
      id: number;
      date: Date;
    }[]
  >("usersPlayed", []);

  const usersFiltered = useMemo(() => {
    if (!usersRemoved) return users;
    return users.filter((_, i) => !usersRemoved.includes(i));
  }, [users, usersRemoved]);

  const { width, height } = useWindowSize();
  const [havePlayed, setHavePlayed] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [fakeUserSelected, setFakeUserSelected] = useState<number | null>(null);
  const [activeConfetti, setActiveConfetti] = useState<boolean>(false);
  const [animationIsRunning, setAnimationIsRunning] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const delayFakeTimeUser = useMotionValue(1);
  const percentageLoaded = useTransform(delayFakeTimeUser, [1, usersFiltered.length], [0, 100]);
  const rotate = useTransform(percentageLoaded, [90, 95, 100], [0, 180, 360]);
  const scale = useTransform(percentageLoaded, [90, 94, 97, 100], [1, 0.9, 0.6, 1]);
  useEffect(() => {
    delayFakeTimeUser.on("change", (value) => {
      setFakeUserSelected(Math.floor(value));
    });
  }, [rotate, scale]);
  const playSound = () => {
    const audio = new Audio(SoundRoulette as any);
    audio.play();
  };
  const getRandomUser = () => {
    delayFakeTimeUser.set(0);
    playSound();
    setHavePlayed(true);
    const randomIndex = Math.floor(Math.random() * usersFiltered.length);
    setSelectedUser(randomIndex);
    setUsersPlayed([
      ...(usersPlayed ?? []),
      {
        id: randomIndex,
        date: new Date()
      }
    ]);
    setAnimationIsRunning(true);
    animate(delayFakeTimeUser, usersFiltered.length, {
      duration: DurationTime,
      ease: "easeOut",
      onUpdate: (value) => {
        console.log({
          value
        });
        if (value >= usersFiltered.length - 2) {
          setAnimationIsRunning(false);
          setActiveConfetti(true);
          setFakeUserSelected(null);
        }
      },
      onComplete: () => {}
    });
  };
  const handleRemoveUser = () => {
    if (!selectedUser) return;
    setUsersRemoved([...(usersRemoved ?? []), selectedUser]);
    toast.success("Jugador eliminado correctamente");
  };
  const handleReset = () => {
    setUsersRemoved([]);
    setUsersPlayed([]);
    toast.success("Jugadores reiniciados correctamente");
  };

  const selectedPlayerInfo = useMemo(() => {
    if (selectedUser === null) return null;
    return users[selectedUser];
  }, [selectedUser]);
  const fakeSelectedPlayerInfo = useMemo(() => {
    if (fakeUserSelected === null) return null;
    return users[fakeUserSelected];
  }, [fakeUserSelected]);
  const currentSelectedUserHasBeenRemoved = useMemo(() => {
    if (!usersRemoved || !selectedUser) return false;
    return usersRemoved.includes(selectedUser);
  }, [selectedUser, usersRemoved]);
  const usersPlayedInfo = useMemo(() => {
    if (!usersPlayed) {
      return users;
    }
    return users
      .map((_, i) => {
        const userPlayed = usersPlayed.find((x) => x.id === i);
        if (!userPlayed) {
          return null;
        }
        return {
          ..._,
          date: userPlayed.date
        };
      })
      .filter((x) => x)
      .sort((a, b) => (a!.date > b!.date ? -1 : 1)) as typeof users;
  }, [users, usersPlayed]);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={activeConfetti ? 1000 : 0}
        onConfettiComplete={(c) => {
          setActiveConfetti(false);
          c?.reset();
        }}
      />
      <Center
        bgImage="url('./background.jpg')"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="calc(100dvh)"
        w={"calc(100dvw)"}
        color="white"
      >
        {havePlayed && (
          <motion.div
            style={{
              rotate: rotate,
              scale: scale
            }}
          >
            <Text fontSize="6xl" color={"gray.800"}>
              {fakeSelectedPlayerInfo?.name ?? selectedPlayerInfo?.name}
            </Text>
            <Center>
              <Text fontSize="3xl" color={"gray.800"}>
                {fakeSelectedPlayerInfo?.company ?? selectedPlayerInfo?.company}
              </Text>
            </Center>
          </motion.div>
        )}
        {!havePlayed && (
          <Button
            colorScheme="blue"
            variant="outline"
            size="lg"
            onClick={getRandomUser}
            isDisabled={animationIsRunning}
          >
            Jugar
          </Button>
        )}
      </Center>
      {havePlayed && (
        <Menu>
          <MenuButton
            as={Button}
            colorScheme={"blue.400"}
            variant="outline"
            position="absolute"
            right={0}
            bottom={0}
            m={"2rem"}
          >
            Opciones
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuItem>
              <Button
                colorScheme="blue"
                variant="outline"
                size="lg"
                onClick={getRandomUser}
                w={"100%"}
                isDisabled={animationIsRunning}
              >
                Jugar
              </Button>
            </MenuItem>
            <MenuItem>
              <Button
                colorScheme={"cyan"}
                variant="outline"
                size="lg"
                onClick={onOpen}
                w={"100%"}
                isDisabled={animationIsRunning}
              >
                Historial
              </Button>
            </MenuItem>
            <MenuItem>
              <Button
                colorScheme={"cyan"}
                variant="outline"
                size="lg"
                onClick={handleReset}
                w={"100%"}
                isDisabled={animationIsRunning}
              >
                Resetear jugadores
              </Button>
            </MenuItem>

            <MenuItem>
              <Button
                colorScheme="red"
                variant="outline"
                size="lg"
                onClick={handleRemoveUser}
                w={"100%"}
                isDisabled={currentSelectedUserHasBeenRemoved || animationIsRunning}
              >
                Eliminar jugador
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {isOpen && <HistoricUsers users={usersPlayedInfo} handleClose={onClose} />}
    </>
  );
};

export default RandomUser;
