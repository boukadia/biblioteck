export function Person({Person}){
    return(
        <>
         <div>
            <table>
                <th>name</th>
                <th>gender</th>
                <th>age</th>
            </table>
            <tbody>
                {Person.map((p)=>(
                    (
                <tr style={{background: 'red'}}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                </tr>)
                
                ))}
            </tbody>
        </div>
        </>
       
    )
}