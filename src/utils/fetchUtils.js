 const createNoAuthFetchRequest = async (
  endpoint,
  method,
  data,
) => {
  console.log('request',JSON.stringify(data));
  return fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(resp => resp.json());
};

  export default createNoAuthFetchRequest;
