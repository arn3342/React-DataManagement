import React,{useEffect,useState} from 'react';
import Table from 'react-bootstrap/Table';
import createNoAuthFetchRequest from '../../utils/fetchUtils';
import query from '../../data/queries';
import endpoint from '../../config/endpoints';



//  console.log('query = ',query);
//   let input = {};
//  input = { UnionCode: "1005" };
//  const variables = {
//    input,
//  };
//  const response = fetch('https://ihrxm0ubw3.execute-api.us-east-1.amazonaws.com/development/graphql',{
// method: "POST",
// headers: {
//   "localauthorization":"true",
//   "Content-Type": "application/json",
// },
// body: JSON.stringify({ query,variables, })
// })
// .then(resp => {
// console.info('resp:', resp);
// return resp.json();
// }).then(results => {
// console.log('results = ',results);
// const { data } = results;
// console.log('data = ',data);
// return data;
// })
// .catch(err => {
// console.error(
//   'unionRatesList error:',
//    err,
//  );
// });
// console.log('response : ',response);

const UnionRatesList= () => {
  const [data,setData] = useState([]);

const getTheUnionRates = async () => {
 const variables = {
   input: {
     UnionCode: '1005'
   },
 };

 let rates = await createNoAuthFetchRequest(
   endpoint.grayQl,
   'POST',
   {query,variables},
 );
 console.info('rates:',rates);
 const { data: { unionRatesQuery }} = rates;
 console.info('unionRatesQuery:',unionRatesQuery);
 setData(unionRatesQuery);
};

  useEffect(() => {
    getTheUnionRates();
 },[setData]);


console.log('data', data);



return(
<Table striped bordered hover size="sm">
  <thead>
    <tr>
      <th>Id</th>
      <th>Union Code</th>
      <th>Union Description</th>
      <th>Step</th>
      <th>Step Description</th>
      <th>Shift</th>
      <th>Shift Description</th>
      <th>Rate</th>
    </tr>
  </thead>
  <tbody>
    {data.map(line =>
      <tr key={line.id}>
        <td>{line.id}</td>
        <td>{line.UnionCode}</td>
        <td>{line.UnionCodeDesc}</td>
        <td>{line.JobStep}</td>
        <td>{line.JobStepDesc}</td>
        <td>{line.ShiftCode}</td>
        <td>{line.ShiftCodeDesc}</td>
        <td>{line.HourlyRate}</td>
      </tr>)}
  </tbody>
</Table>

);

}
export default UnionRatesList;
