import { ECSClient } from "@aws-sdk/client-ecs";
import  {awsConfig}  from "../config/awsConfig2";


export const ecsClient = new ECSClient(awsConfig);
