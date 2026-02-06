const OpenAI = require("openai");

const City = require("../models/City");

const lawsChoosing = require("./lawsChoosing");


async function processCity() {
  lawsToContribute = await lawsChoosing();
  var city = await City.findOne();

  var prompt = `
  Ты симулятор города. \n 

  Исходные данные города:\n 
  population: ${city.population}\n
  happiness: ${city.happiness}\n
  wealth: ${city.wealth}\n
  crime: ${city.crime}\n
  trust: ${city.trust}\n

  Принятые законы:\n
  1: ${lawsToContribute[0]}\n
  2: ${lawsToContribute[1]}\n
  3: ${lawsToContribute[2]}\n

  Твоя задача:
  1) просчитать изменения в данных города за год с данными законами\n
  2) Написать короткий текст (5-7 предложений), описывающий события года\n
  3) Упомянуть неожиданный побочный эффект\n
  4) Вернуть JSON строго в формате:\n
  {
    "final_changes": { ... },
    "story": "..."
  }
  `;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
  model: "gpt-4.1",
  messages: [
    {
      role: "system",
      content: "Ты детерминированный симулятор. Никаких пояснений вне JSON."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "city_simulation",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          final_changes: {
            type: "object",
            additionalProperties: false,
            properties: {
              population: { type: "number" },
              happiness: { type: "number" },
              wealth: { type: "number" },
              crime: { type: "number" },
              trust: { type: "number" }
            },
            required: [
              "population",
              "happiness",
              "wealth",
              "crime",
              "trust"
            ]
          },
          story: {
            type: "string",
            description: "5–7 предложений, с неожиданным побочным эффектом"
          }
        },
        required: ["final_changes", "story"]
      }
    }
  }
});

const result = JSON.parse(
  response.choices[0].message.content
);

console.log(result);

await City.updateOne(
  {},
  {
    $set: {
      year: city.year + 1,
      population: result.final_changes.population,
      happiness: result.final_changes.happiness,
      wealth: result.final_changes.wealth,
      crime: result.final_changes.crime,
      trust: result.final_changes.trust
    }
  },
  {}
);

await Law.deleteMany({});
await Vote.deleteMany({});

}

module.exports = processCity;