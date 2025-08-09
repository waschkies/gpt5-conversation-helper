export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { name, company } = req.body;
  if (!name || !company) {
    return res.status(400).json({ error: "Name and company are required" });
  }

  const prompt = `
Du bist ein Assistent, der Gesprächsleitfäden erstellt.
Erstelle einen Leitfaden für ein Treffen mit ${name} von der Firma ${company}.
Berücksichtige mögliche Gesprächspunkte, Networking-Tipps und Hintergrundfragen.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}