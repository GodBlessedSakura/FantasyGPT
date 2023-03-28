const axios = require("axios");

const apiKey = process.env.API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

export async function generateResponse(messages, max_tokens = 1000) {
  const response = await axios.post(
    endpoint,
    {
      model: "gpt-3.5-turbo",
      messages,
      max_tokens,
      temperature: 0.5,
      // stream: true,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      // responseType: "stream", // 设置响应类型为流
    }
  );

  // Todo:流式回复

  // let responseData = "";
  // // return response;
  // response.data.on("data", (chunk) => {
  //   const curData = JSON.parse(chunk.toString().split("data: ")[1]);
  //   console.log(curData);
  // });

  const responseText = response.data.choices[0].message.content.trim();
  const consumedTokens = response.data.usage.total_tokens;
  return {
    responseText,
    consumedTokens,
  };
}

// Example usage
// generateResponse("给我一个打印helloword的代码示例").then((res) =>
//   console.log(res)
// );
