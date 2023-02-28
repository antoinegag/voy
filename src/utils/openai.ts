const { Configuration, OpenAIApi } = require("openai");
const moment = require("moment");
import { CodeEngine } from "prompt-engine";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface GenerateGoalParams {
  sportName: string;
  startDate: Date;
  endDate: Date;
  goal: number;
  unit: string;
}

export async function generateGoal({
  sportName,
  startDate,
  endDate,
  goal,
  unit,
}: GenerateGoalParams) {
  const codeEngine = new CodeEngine(description, examples, "", {
    modelConfig: {
      maxTokens: 2000,
    },
  });

  const query = `Give me a plan to do a total of ${goal} ${unit} of ${sportName} from ${moment(
    startDate
  ).format("DD MMMM YYYY")} to ${moment(endDate).format(
    "DD MMMM YYYY"
  )} in this JSON format: {"name": "goal name here", "description": "goal description here", plan: {"month": {"week": {"milestone": "value here", "focus": "description of focus for the week here in motivational tone"}}}. Make sure the total amount of ${unit} sums to ${goal} and the intensity is gradual every week.`;

  const prompt = codeEngine.buildPrompt(query);

  console.log("Fetching GPT-3");
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2000, // TODO: this is very high
  });

  const choice = completion.data.choices[0].text;

  let plan;

  try {
    plan = JSON.parse(choice);
  } catch (error) {
    console.log(error);
    return { error: "Unable to parse GPT-3 output", plan: null };
  }

  return { plan, error: null };
}

const description =
  "Natural Language training plan to reach a goal to JSON object. The JSON object should contain a name, a description and a list of milestones to reach the goal";

const examples = [
  {
    input: `Give me a plan to do a total of 5000 km of Cycling from 27 February 2023 to 27 May 2023 in this JSON format: {"name": "goal name here", "description": "goal description here", plan: {"month": {"week": {"milestone": "value here", "focus": "description of focus for the week here in motivational tone"}}}. Make sure the total amount of km sums to 5000 and the intensity is gradual every week."`,
    response: `
  {
    "name": "5000km Cycling Challenge",
    "description": "Challenge myself to cycle 5000km in a span of three months",
    "plan":
    {
      "February": {
        "Week 1": {
          "milestone": "400 km",
          "focus": "Focus on feeling the rhythm of the road and cycle smoothly."
        },
        "Week 2": {
          "milestone": "400 km",
          "focus": "Challenge yourself to beat your last week's record by even a small fraction."
        },
        "Week 3": {
          "milestone": "450 km",
          "focus": "Be brave and try ascending hills and challenge yourself."
        },
        "Week 4": {
          "milestone": "450 km",
          "focus": "Maintain the newfound intensity and keep the fire burning."
        }
      },
      "March": {
        "Week 1": {
          "milestone": "500 km",
          "focus": "Focus on longer term objectives and stay motivated on the roads."
        },
        "Week 2": {
          "milestone": "500 km",
          "focus": "Break till maintenance week but make sure you don't lose momentum."
        },
        "Week 3": {
          "milestone": "550 km",
          "focus": "Maintain your cycling gears so that they don't stand in between your goals."
        },
        "Week 4": {
          "milestone": "550 km",
          "focus": "Keep pushing yourself and strive to do better."
        }
      },
      "April": {
        "Week 1": {
          "milestone": "600 km",
          "focus": "Take time off rest but use the freshness to cycle with more energy."
        },
        "Week 2": {
          "milestone": "600 km",
          "focus": "Have regular checkups of your joint pains and make sure you're all set."
        },
        "Week 3": {
          "milestone": "650 km",
          "focus": "Prepare for the last lap and challenge yourself to go for the kill."
        },
        "Week 4": {
          "milestone": "650 km",
          "focus": "You are almost there! Dig deep and bring out your best for the end spurt."
        }
      },
      "May": {
        "Week 1": {
          "milestone": "700 km",
          "focus": "Stay motivated and take time with the last steps."
        },
        "Week 2": {
          "milestone": "700 km",
          "focus": "Don't be afraid to rest and relax as well to keep going."
        },
        "Week 3": {
          "milestone": "750 km",
          "focus": "Pace yourself to finish this epic cycling trip."
        },
       "Week 4": {
          "milestone": "750 km",
          "focus": "You can do it! Enjoy the last bits of your journey and achieve success!"
        }
      }
     }
    }
  `,
  },
];
