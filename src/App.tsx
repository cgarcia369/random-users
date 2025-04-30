import { ChakraProvider } from "@chakra-ui/react";
import RandomUser from "./components/RandomUser.tsx";
import text from "/users.txt?raw";
import { ToastContainer } from "react-toastify";
const users = text
  .split("\n")
  .map((x) => x.replace("\r", ""))
  .map((x) => x.trim())
  .map((x) => {
    const splitUser = x.split(";");
    return {
      name: splitUser[0].toUpperCase(),
      company: splitUser[1].toUpperCase()
    };
  });
console.log(process.env.VITE_TEST);
function App() {
  return (
    <>
      <ChakraProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <RandomUser users={users} />
      </ChakraProvider>
    </>
  );
}

export default App;
