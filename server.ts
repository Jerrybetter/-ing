import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  app.post("/api/analyze-desk", async (req, res) => {
    try {
      const { imagesBase64 } = req.body;
      
      if (!imagesBase64 || !Array.isArray(imagesBase64) || imagesBase64.length === 0) {
        return res.status(400).json({ error: "No images provided" });
      }

      const prompt = `基于用户上传的多张实拍图片，完成「工位人格测评」。请综合分析所有提供的图片。
      
首要任务：严格判断提供的所有图片是否包含工位、办公桌、电脑桌或学习桌环境。只要画面中有桌子、电脑（无论笔记本或台式）、显示器、办公或学习用品等元素，哪怕摆满了手办、杂物，都可以认为是工位。
注意：如果提供的多张图片中，**包含任何一张完全不属于办公/学习环境的图片**（例如纯风景、纯人物自拍、二次元插画、与办公毫无关系的截图等），请严格将 isWorkspace 设为 false。只有当所有图片都符合工位特征，才将 isWorkspace 设为 true。
如果 isWorkspace 为 false，其他字段随意填充有效值即可。
如果 isWorkspace 为 true，请继续基于图片完成后续测评。
      
置信判定规则：
1. 物证充足：输出百分比、对应倾向解读；
2. 证据不足、无法判定：使用 50% 居中占位，改为开放式灵魂拷问；
3. 禁止通过静态照片过度推演长期行为。示例：书本闭合摆放 ≠ 很少看书，仅客观描述画面状态，不武断定性。

彩蛋约束：最多筛选1-3条最有反差、最有意思的细节，宁缺毋滥，拒绝流水账罗列；彩蛋仅作为趣味观察，不参与人格维度打分、不纳入结论。
优先抓取：风格反差摆件、陈列书籍、闲置设备、特殊装饰、极具个人特色的小物件；优先选择有冲突感、适合玩梗的细节。

人格标题规则：提取量表最强倾向，控制4～7个字，生动有记忆点，适合社交转发。

四大核心观测维度（固定二元对立）：
维度1: 游牧Nomad ↔ 扎根Root (随时游牧 ↔ 就地扎根)
核心问题：你把这里当成暂留的驿站，还是第二个家？
观测线索：重点观察【生活起居用品】。只有水杯、必备品 = 随时游牧；有抱枕、毯子、拖鞋、养生壶、牙刷、大容量收纳箱 = 就地扎根。玩具手办不计入此维度！

维度2: 秩序Order ↔ 可视Visible (依赖秩序 ↔ 依赖可视)
核心问题：你依赖秩序，还是依赖看得见？
观测线索：物品收纳方式。全部收纳归位 = 信任系统；物品摊在视野内 = 害怕遗忘。

维度3: 工具Tool ↔ 情绪Emotion (纯粹工具 ↔ 情绪价值)
核心问题：这个工位仅仅是生产力工具，还是你的精神庇护所？
观测线索：重点观察【非办公必需品】。极简、只有电脑外设 = 纯粹工具；有手办、毛绒玩具、香薰、明星周边、花草 = 情绪价值。

维度4: 硬扛Endure ↔ 自救Rescue (硬扛消耗 ↔ 主动自救)
核心问题：你在用身体扛这份工作吗？
观测线索：支架、眼药水、颈枕、脚垫、护具、药品等劳损防护物品。

文风规范：
语言风格：化身拥有读心术的职场心理学侦探，通过桌面上的蛛丝马迹，推测用户的真实职场状态、性格和协作模式。极致清醒吐槽，阴阳怪气但不惹人厌，毒舌、尖锐、幽默，狠狠戳中打工人痛点，贴合当代职场打工人语境，带点脱口秀的味道。绝对不要像机器人或者官方客服！
单条解读控制在2～3行。不要枯燥的客观描述，不要单向吹捧，要带有强烈的喜剧冲突感和梗味。

你需要额外推理：
1. 【工作习惯推测】：根据桌面状态，推理该用户的行为习惯。例如：乱飞的便利贴说明“多线程运作且随时会断线”；干净到发指可能是“边界感极强的控制狂”；喜欢放一堆盲盒可能是“靠即时多巴胺续命”。
2. 【常见口头禅/潜台词】：基于上述人格，推测他在工作群里最常说的话。例如防御型打工人：“这个之前确认过了吧？” 试探型打工人：“这个可以......吗？是不是还得......？” 摆烂型：“好的呢~（内心：毁灭吧）”。

请根据以上规则，综合分析提供的所有图片，并严格以要求的JSON格式输出。所有输出内容使用中文。
`;

      const parts: any[] = [{ text: prompt }];
      
      for (const base64 of imagesBase64) {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({ inlineData: { data: base64Data, mimeType: "image/jpeg" } });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: {
          parts: parts
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isWorkspace: { type: Type.BOOLEAN, description: "所有图片是否都包含工位或办公环境元素。如果有任何一张图片完全无关（如纯风景、纯自拍等），必须设为 false。" },
              title: { type: Type.STRING, description: "工位人格标题，4-7字，生动有记忆点" },
              dimensions: {
                type: Type.OBJECT,
                properties: {
                  nomad: {
                    type: Type.OBJECT,
                    properties: {
                      leftPercentage: { type: Type.INTEGER, description: "游牧百分比" },
                      rightPercentage: { type: Type.INTEGER, description: "扎根百分比" }
                    },
                    required: ["leftPercentage", "rightPercentage"]
                  },
                  order: {
                    type: Type.OBJECT,
                    properties: {
                      leftPercentage: { type: Type.INTEGER, description: "秩序百分比" },
                      rightPercentage: { type: Type.INTEGER, description: "可视百分比" }
                    },
                    required: ["leftPercentage", "rightPercentage"]
                  },
                  function: {
                    type: Type.OBJECT,
                    properties: {
                      leftPercentage: { type: Type.INTEGER, description: "功能百分比" },
                      rightPercentage: { type: Type.INTEGER, description: "留白百分比" }
                    },
                    required: ["leftPercentage", "rightPercentage"]
                  },
                  endure: {
                    type: Type.OBJECT,
                    properties: {
                      leftPercentage: { type: Type.INTEGER, description: "硬扛百分比" },
                      rightPercentage: { type: Type.INTEGER, description: "自救百分比" }
                    },
                    required: ["leftPercentage", "rightPercentage"]
                  }
                },
                required: ["nomad", "order", "function", "endure"]
              },
              interpretations: {
                type: Type.ARRAY,
                description: "工位解读，4条，分别对应四个维度。幽默玩梗、尖锐不刻薄。",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dimension: { type: Type.STRING, description: "例如：【游牧/扎根】" },
                    text: { type: Type.STRING, description: "简短犀利趣味解读。如果证据不足则为灵魂拷问。" }
                  },
                  required: ["dimension", "text"]
                }
              },
              easterEggs: {
                type: Type.ARRAY,
                description: "工位细节彩蛋，1-3条，纯趣味观察",
                items: { type: Type.STRING }
              },
              tags: { type: Type.STRING, description: "拓展特质标签，例如：强陈列Display倾向" },
              workHabits: {
                type: Type.ARRAY,
                description: "基于桌面细节推断的职场工作习惯，2-3条，犀利准确",
                items: { type: Type.STRING }
              },
              catchphrases: {
                type: Type.ARRAY,
                description: "基于性格推断的常见职场口头禅或潜台词，带有强烈的真实感和幽默感，2-3条",
                items: { type: Type.STRING }
              }
            },
            required: ["isWorkspace", "title", "dimensions", "interpretations", "easterEggs", "tags", "workHabits", "catchphrases"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response from Gemini");
      }
      
      const result = JSON.parse(responseText);

      if (result.isWorkspace === false) {
        return res.json({ isWorkspace: false, message: "图片好像不是工位哦，换一张你的真实工位照吧～" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  app.post("/api/redesign-desk", async (req, res) => {
    try {
      const { imageBase64, stylePrompt, size } = req.body;
      if (!imageBase64 || !stylePrompt) {
        return res.status(400).json({ error: "Missing imageBase64 or stylePrompt" });
      }

      const apiKey = process.env.REDNOTE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "REDNOTE_API_KEY environment variable is missing" });
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const blob = new Blob([buffer], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('model', 'gpt-image-2');
      formData.append('image[]', blob, 'desk.jpg');
      
      const prompt = `你是一位专业的桌搭设计师和室内设计师。

请根据用户上传的工位照片，对工位进行风格化改造。

要求：
- 保留原始工位的布局、拍摄角度和主要物品位置，不要改变桌子、显示器、电脑等主体结构。
- 在此基础上调整家具、灯光、桌面收纳、摆件、配色和装饰，使整体符合指定风格。
- 优先使用现实世界中存在的家具、灯具、收纳、桌搭配件和装饰品，避免生成难以购买或充满 AI 感的设计。
- 尽量采用 IKEA、MUJI、Herman Miller、Hay、USM、Logitech、BenQ、Keychron 等真实品牌风格（无需展示品牌 Logo）。
- 保持符合真实室内摄影效果，光影自然，材质真实，细节丰富。
- 不要改变房间结构，不新增窗户、门或不存在的大型家具。
- 输出应具有较强的真实感，方便用户通过图片搜索找到相似商品进行购买。

${stylePrompt}

禁止：
- 改变相机视角
- 改变工位整体布局
- 删除电脑、显示器等主要设备
- 添加人物、动物
- 添加科幻、魔法、赛博朋克等虚构元素
- 生成不存在现实中的家具或装饰品
- 夸张的 AI 艺术风格`;
      formData.append('prompt', prompt);
      formData.append('n', '1');
      formData.append('size', size || '1024x1024');
      formData.append('quality', 'medium');
      formData.append('output_format', 'jpeg');
      formData.append('output_compression', '80');

      const response = await fetch('https://maas.devops.rednote.life/hackson/openai/images/edits?api-version=2025-04-01-preview', {
        method: 'POST',
        headers: {
          'api-key': apiKey
        },
        body: formData as any
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Redesign API error:", errorText);
        throw new Error("Failed to generate image from external API: " + response.status);
      }

      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        const item = data.data[0];
        if (item.url) {
          return res.json({ imageUrl: item.url });
        } else if (item.b64_json) {
          return res.json({ imageUrl: `data:image/jpeg;base64,${item.b64_json}` });
        }
      }
      throw new Error("Invalid response from redesign API");

    } catch (error) {
      console.error("Error redesigning desk:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to redesign desk" });
    }
  });

  app.get("/api/rednote-key", (req, res) => {
    res.json({ key: process.env.REDNOTE_API_KEY || process.env.VITE_REDNOTE_API_KEY || "" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
