import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  ModalContent,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Center
} from "@chakra-ui/react";
type HistoricPlayersProps = {
  users: {
    name: string;
    company: string;
  }[];
  handleClose: () => void;
};

const HistoricUsers = ({ users, handleClose }: HistoricPlayersProps) => {
  return (
    <>
      <Modal isOpen={true} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent maxH={"calc(100dvh - 8rem)"} minW={"calc(70dvw)"}>
          <ModalHeader>
            <Center>Historial de jugadores</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH={"calc(100%)"} overflow={"auto"}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nombre</Th>
                    <Th>Empresa</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.name}</Td>
                      <Td>{user.company}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HistoricUsers;
