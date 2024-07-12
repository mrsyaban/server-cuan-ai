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
const model = "gemini-1.5-flash-001";
const textsi_1 = {
  text: `
I will provide you with input in the following format:

- stock: [stock name]
- net_profit: [value]
- eps: [value]
- pbv: [value]
- roe: [value]
- debt/equity: [value]

Your task is to analyze the health of the company based on the provided financial values. Here are the abbreviations:
- net_profit: Net Profit
- eps: Earnings Per Share
- pbv: Price to Book Value
- roe: Return on Equity
- debt/equity: Debt to Equity Ratio

Provide a complete summary of the company's health based on these values (MUST mention the stock name in summary) and assign a health score between 0 and 10 (decimals allowed with accuracy to 0.1, with 5.0 being the netral). Don't give suggestions to do further research.

Return the response as a JSON-like string (only change the values, keep the exact same string format) such as:
{
  "company_health": {
    "score": 7.7,
    "summary": "STOCK NAME IS Your analysis here."
  }
}
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

export async function generateHealthAnalysis(
  stock: string,
  net_profit: Number,
  eps: Number,
  pbv: Number,
  roe: Number,
  debt_equity: Number
) {
  const req = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `stock: ${stock} net_profit:${net_profit} eps:${eps} pbv:${pbv} roe:${roe} debt/equity:${debt_equity} `,
          },
        ],
      },
    ],
  };

  const resp = await generativeModel.generateContent(req);

  const response =
    resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
    '{"company_health": {"score": 0, "summary": "Connection Error."}}';

  const sentiment_json = JSON.parse(response);
  return sentiment_json;
}
