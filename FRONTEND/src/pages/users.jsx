import { Person } from "./person";

export function users(){
    const  persons = [
  { name: "Alice", gender: "female", age: 25 },
  { name: "Bob", gender: "male", age: 30 },
  { name: "Charlie", gender: "male", age: 22 },
  { name: "Diana", gender: "female", age: 28 },
  { name: "Ethan", gender: "male", age: 35 }
];
    return(
        <>
       <Person users={persons}/>
        </>
    )
}