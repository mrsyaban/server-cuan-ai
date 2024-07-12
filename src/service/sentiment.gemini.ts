import {
  Content,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
  project: "gen-lang-client-0945252361",
  location: "us-central1",
});
const model = "gemini-1.5-pro-001";
const textsi_1 = {
  text: `
  Return the response as a JSON-like string (only change the values, keep the exact same string format) such as:
  {
    "realtime_analysis": {
      "sentiment": 2.1,
      "reasoning": "wawaawa"
    }
  }
  I will provide you with input in the following format:
  
  - stock: [stock name]
  - topic: array of { name: String; sentiment: Number }
  - news: [news]
  
  Your task is to analyze the sentiment of the stock's price (with the each topic is affecting positively(if sentiment is 1) or negatively (is the sentiment is -1) with the price) based on the news and provide a sentiment value between 0 and 10 (decimals allowed with accuracy to 0.1, with 5.0 being the netral) along with reasoning. Note that the stock parameter is just a name for the stock being analyzed and should not be linked or considered as the real company behind it.
  
  `,
};

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 512,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  systemInstruction: {
    parts: [textsi_1],
  } as Content,
});

export async function generateSentimentAnalysis(
  stock: string,
  topic: { name: String; sentiment: Number }[],
  news: string
) {
  try {
    const req = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `topic: ${topic} stock: ${stock} news: ${news}`,
            },
          ],
        },
      ],
    };

    const resp = await generativeModel.generateContent(req);

    const response =
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      '{"sentiment": 0, "reasoning": "Connection error"}';

    const sentiment_json = await JSON.parse(response);
    return sentiment_json;
  } catch (error) {
    throw error;
  }
}
