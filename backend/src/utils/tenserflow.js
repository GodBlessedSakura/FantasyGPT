import { encoder } from "./tfnlp";

// 计算当前会话与历史会话的相似度
export async function getRelatedConversations(history, similarity = 0.5) {
  const current = history[history.length - 1];
  const curText = current.text;
  const historyTexts = history.map((conversation) => conversation.text);
  const encodedHistory = await encoder.embed(historyTexts);
  const encodedCurrent = await encoder.embed(curText);
  const encodedCurrentT = encodedCurrent.transpose();
  const similarities = encodedHistory.matMul(encodedCurrentT).arraySync();
  const relatedConversations = history.filter(
    (item, key) => similarities[key][0] >= similarity
  );
  return relatedConversations;
}
