import { create } from "ipfs-http-client";
const projectId = '2EYQ8Ubml2sF30ZgExtvG6MSK6b'
const projectSecret = 'db869bfd6bf8567eb19c421feb7dfe91'

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
	authorization: auth
  }

});

const uploadToIPFS = async <T>(data: T): Promise<string> => {
  const result = await client.add(JSON.stringify(data));
console.log(result)
  return result.path;
};




export default uploadToIPFS;
