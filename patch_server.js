const fs = require('fs');

const code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
  app.post("/api/check-workspace", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64" });
      }

      const base64Data = imageBase64.replace(/^data:image\\/\\w+;base64,/, "");
      
      const verificationResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: "这张图片是否包含真实的工位或办公环境？如果只是纯风景、纯自拍、与工作无关的物品，回答 false。回答 true 或 false。" },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: "image/jpeg"
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isWorkspace: { type: Type.BOOLEAN, description: "图片是否包含工位或办公环境。" }
            },
            required: ["isWorkspace"]
          }
        }
      });
      
      const responseText = verificationResponse.text;
      if (!responseText) {
        throw new Error("No response from Gemini");
      }
      
      const result = JSON.parse(responseText);
      res.json(result);
    } catch (error) {
      console.error("Error checking workspace:", error);
      res.status(500).json({ error: "Failed to check workspace" });
    }
  });
`;

if (!code.includes('/api/check-workspace')) {
  const insertIndex = code.indexOf('app.post("/api/redesign-desk"');
  const newCode = code.slice(0, insertIndex) + newEndpoint + code.slice(insertIndex);
  fs.writeFileSync('server.ts', newCode);
  console.log('Endpoint added');
} else {
  console.log('Endpoint already exists');
}
