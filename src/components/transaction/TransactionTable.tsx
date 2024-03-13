import axios from "../../api/axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RxCaretSort } from "react-icons/rx";
import ExpenseAccountFilter from "../ExpenseAccountFilter";
import ExpenseCategoryFilter from "../ExpenseCategoryFilter";
const GET_TRANSACTION_URL = "/api/transactions";

interface Transaction {
  type: string;
  amount: number;
  note: string;
  description: string;
  date: string;
  id: string;
}

interface Category {
  id: number;
  name: string;
}
interface Account {
  id: number;
  name: string;
}
interface Props {}

export const TransactionTable = ({}: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get<Transaction[]>(GET_TRANSACTION_URL, {
        headers: {
          "x-auth-token": auth.accessToken,
        },
      })
      .then((res) => setTransactions(res.data));
  }, [ignored]);

  console.log("transactionTable.tsx rendered");

  return (
    <Box boxShadow={"dark-lg"} p={5} borderRadius={5} m={2} w={"90%"}>
      <Button onClick={forceUpdate}>re-render</Button>

      <Text as={"h1"}>Transactions for {auth.email}</Text>
      <Table size={"xs"}>
        <Thead fontSize={"xs"}>
          <Tr>
            <Th p={3}>Time</Th>
            <Th p={3}>Type</Th>
            <Th p={3}>Amount</Th>
            {/* <Th>
              <ExpenseAccountFilter
                onSelectedAccount={(account) => onSelectedAccount(account)}
              ></ExpenseAccountFilter>
            </Th>
            <Th p={3}>
              <ExpenseCategoryFilter
                onSelectedCategory={(category) => onSelectCategory(category)}
              ></ExpenseCategoryFilter>
            </Th> */}
            <Th p={3}>
              <HStack>
                <Text>note</Text>
                <RxCaretSort />
              </HStack>
            </Th>
            <Th p={3}>Des</Th>
            <Th p={3}>Edit</Th>
            <Th p={3}>Delete</Th>
          </Tr>
        </Thead>
        <Tbody fontSize={"xs"}>
          {transactions
            .slice(0)
            .reverse()
            .map((transaction) => (
              <Tr key={transaction.id}>
                <Td p={3}>{transaction.date}</Td>
                <Td p={3}>{transaction.type}</Td>
                <Td p={3} pl={2}>
                  {transaction.amount}
                </Td>
                {/* <Td p={3} pl={2}>
                  {transaction.acountId}
                </Td>
                <Td pl={2}>{transaction.categoryId}</Td> */}
                <Td>{transaction.note}</Td>
                <Td>{transaction.description}</Td>
                <Td>
                  <Button fontSize={"xs"} size={"xs"} colorScheme="teal">
                    Edit
                  </Button>
                </Td>
                <Td>
                  <Button fontSize={"xs"} size={"xs"} colorScheme="red">
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
        <Tfoot fontSize={"xs"}>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th p={3}>Total</Th>
            <Th>
              $
              {transactions
                .reduce((acc, transaction) => transaction.amount + acc, 0)
                .toFixed(2)}
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  );
};
