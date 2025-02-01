// // src/interfaces/consumers/MovieConsumer.ts
// import { Channel, ConsumeMessage } from "amqplib";
// import amqp from "amqplib";
// import { title } from "process";
// import { CreateMovieUseCase } from "../../use-case/createMovieMetadata";
// import { VideoMetadataRepository } from "../repositories/VideoMetadataRepository";
// // import { ProcessMovieUseCase } from "../../application/useCases/ProcessMovieUseCase";

// const processMovieUseCase = new CreateMovieUseCase(
//   new VideoMetadataRepository()
// );

// export class MovieConsumer {
//   private queueName: string = "movie_upload_queue";
//   private retries: number = 5;

//   constructor() {
//   }

//   async start(): Promise<void> {
//     let connection = null;
//     while (this.retries) {
//       try {
//         connection = await amqp.connect("amqp://rabbitmq:5672");
//         const channel = await connection.createChannel();
//         await channel.assertQueue(this.queueName, { durable: true });

//         // Consume messages and handle them
//         channel.consume(this.queueName, this.handleMessage(channel), {
//           noAck: false,
//         });
//         break;
//       } catch (error) {
//         console.error("Error connecting to RabbitMQ, retrying...", error);
//         this.retries -= 1;
//         await new Promise((res) => setTimeout(res, 5000)); 
//       }
//     }

//     if (!connection) {
//       throw new Error("Failed to connect to RabbitMQ after multiple attempts");
//     }
//   }

//   private handleMessage(channel: Channel) {
//     return async (msg: ConsumeMessage | null) => {
//       if (msg) {
//         try {
//           const res = JSON.parse(msg.content.toString());
//           console.log("Movie Metadata received from RabbitMQ:", res);
//           const {  movieData } = res;

//           const movie = await processMovieUseCase.execute(movieData);
//           if (movie) {
//             channel.ack(msg);
//           }
//         } catch (error) {
//           console.error("Error processing movie message:", error);
//           channel.nack(msg, false, true); 
//         }
//       }
//     };
//   }
// }
