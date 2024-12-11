import { Client } from "@saplingai/sapling-js/client";
import "dotenv/config";

const apiKey = process.env.API_KEY;

const client = new Client(apiKey);

export async function checkGrammar(text) {
  try {
    const response = await client.edits(text); // Send the text to API to correct it
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error with Sapling API:", error);
    throw new Error("Failed to check grammar");
  }
}
