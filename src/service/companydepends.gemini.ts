import { Content, HarmBlockThreshold, HarmCategory, VertexAI } from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
    project: "gen-lang-client-0945252361",
    location: "us-central1",
  });
  const model = "gemini-1.5-pro-001";
  const textsi_1 = {
    text: `
    Return the response as a JSON-like string (only change the values, keep the exact same string format) such as:
    [
        "something that affect company",
        "something that affect company",
        "something that affect company",
    ]
    I will provide you with input in the following format:
    
    - description: Description About a Company
    
    Your task is to analyze the company bussiness and what kind of macro economy things that affect the company bussiness. for example: 'coal price rising', 'goverment cut off budget about energy", "inflation rising", etc.
    
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


  export async function generateCompanyFactors(
    description: string,
  ) {
    const req = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `description: ${description} `,
            },
          ],
        },
      ],
    };
  
    const resp = await generativeModel.generateContent(req);
  
    const response =
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '{"message": "Error"}';
  
    const sentiment_json = JSON.parse(response);
    return sentiment_json;
  }
  