import type { S3Event } from "aws-lambda";

export function parseS3Event(body: string): S3Event | null {
  try {
    const event = JSON.parse(body) as S3Event;
    return event;
  } catch (error) {
    console.error("Error parsing S3 event:", error);
    return null;
  }
}
