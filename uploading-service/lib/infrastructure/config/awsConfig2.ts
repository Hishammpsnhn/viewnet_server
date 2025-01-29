import environment from "./environment";

if(!environment.AWS_ACCESS_KEY_ID || !environment.AWS_SECRET_ACCESS_KEY || !environment.AWS_REGION){
  throw new Error("Missing required AWS environment variables");
 
}

export const awsConfig = {
    region:  environment.AWS_REGION,
    credentials: {
      accessKeyId:environment.AWS_ACCESS_KEY_ID,
      secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    },
  };