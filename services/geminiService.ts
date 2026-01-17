
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const suggestSolution = async (error: string, symptoms: string, category: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tôi là một lập trình viên. Tôi gặp lỗi thuộc danh mục ${category}: "${error}". 
      Bối cảnh: "${symptoms}". 
      Hãy đưa ra giải pháp ngắn gọn, các bước khắc phục và bài học kinh nghiệm bằng tiếng Việt. Định dạng Markdown.`,
      config: { temperature: 0.7 }
    });
    return response.text || "Không thể tìm thấy gợi ý.";
  } catch (err) {
    return "Lỗi kết nối AI. Vui lòng kiểm tra lại.";
  }
};

export const analyzeProductivity = async (tasks: any[]) => {
  const ai = getAI();
  const taskList = tasks.map(t => `- [${t.status}] ${t.title} (${t.view})`).join('\n');
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Dưới đây là danh sách công việc của tôi được phân loại theo hàng ngày, hàng tuần, hàng tháng:\n${taskList}\n
      Hãy phân tích năng suất làm việc của tôi bằng tiếng Việt. Đưa ra 3 lời khuyên thực tế để cải thiện và một câu truyền cảm hứng ngắn gọn.`,
    });
    return response.text || "Chưa có phân tích.";
  } catch (err) {
    return "Lỗi phân tích năng suất.";
  }
};
