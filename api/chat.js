import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      console.error("Method not allowed:", req.method);
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, company } = req.body;
    console.log("Request body:", req.body);

    if (!name || !company) {
      console.error("Missing name or company in request body");
      return res.status(400).json({ error: "Missing name or company" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a conversation guide for ${name} from ${company}.`
        }
      ],
    });

    console.log("OpenAI response:", response);

    if (!response.choices || response.choices.length === 0) {
      console.error("No choices returned from OpenAI");
      return res.status(500).json({ error: "No choices returned from OpenAI" });
    }

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
