
import { GoogleGenAI, Type } from "@google/genai";
import { Staff, Shift } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSchedulingInsights(staff: Staff[], shifts: Shift[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `วิเคราะห์ตารางเวรโรงพยาบาลนี้และสรุปความครอบคลุมและประสิทธิภาพเป็นภาษาไทยแบบสั้นๆ:
      Staff: ${JSON.stringify(staff)}
      Shifts: ${JSON.stringify(shifts)}
      `,
      config: {
        systemInstruction: "คุณคือผู้เชี่ยวชาญด้านการจัดการทรัพยากรโรงพยาบาล ให้คำแนะนำที่เป็นมืออาชีพ สั้นกระชับ และเป็นภาษาไทยเท่านั้น",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ไม่สามารถดึงข้อมูลเชิงลึกได้ในขณะนี้";
  }
}
