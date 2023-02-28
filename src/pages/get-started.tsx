import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { type NextPage } from "next";

import Button from "../components/Button";
import { SparklesIcon } from "@heroicons/react/24/outline";
import SportListBox from "../components/SportListBox";
import { Sport } from "@prisma/client";
import DatePicker from "react-datepicker";
import { Comment } from "react-loader-spinner";

import "react-datepicker/dist/react-datepicker.css";
import { api } from "../utils/api";
import { signOut } from "next-auth/react";

interface GenerateQueryInput {
  goal: number;
  sportId: string;
  startDate: Date;
  endDate: Date;
  unit: string;
}

interface GoalFormProps {
  onSubmit(input: GenerateQueryInput): void;
  isFetching: boolean;
}

function GoalForm({ onSubmit, isFetching }: GoalFormProps) {
  const [sport, setSport] = useState<Sport>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const defaultEndDate = new Date();
    defaultEndDate.setMonth((new Date().getMonth() + 3) % 11);
    return defaultEndDate;
  });
  const [goal, setGoal] = useState(0);
  const [unit, setUnit] = useState("km");

  return (
    <div className="flex flex-grow flex-col space-y-4">
      <div>
        <div className="mb-2 text-lg">Sport </div>
        <SportListBox onChange={setSport} selectedSport={sport} />
      </div>
      <div>
        <div className="mb-2 text-lg">Timeline</div>
        <div className="flex items-center space-x-2">
          <div>From</div>
          <DatePicker
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            className="w-28 rounded-lg p-2 text-black"
            dateFormat="dd-MM-yyyy"
          />
          <div>To</div>
          <DatePicker
            selected={endDate}
            onChange={(date) => date && setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-28 rounded-lg p-2 text-black"
          />
        </div>
      </div>
      <div>
        <div>
          <div className="mb-2 text-lg">Goal</div>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              name="goal"
              id="goal"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0"
              onChange={(e) => setGoal(parseInt(e.target.value))}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="unit" className="sr-only">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                className="h-full  rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm [&>*]:text-black"
                onChange={(e) => setUnit(e.target.value)}
              >
                <option>km</option>
                <option>hours</option>
                <option>minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-4">
        <Button
          className="bg-green flex w-full items-center justify-center py-2 text-lg"
          prefix={
            !isFetching ? <SparklesIcon className="h-8 w-8" /> : undefined
          }
          suffix={
            !isFetching ? (
              <SparklesIcon className="h-8 w-8 rotate-180" />
            ) : undefined
          }
          onClick={() => {
            if (!isFetching) {
              onSubmit({
                endDate,
                goal,
                sportId: sport?.id ?? "",
                startDate,
                unit,
              });
            }
          }}
        >
          {!isFetching ? (
            "Generate"
          ) : (
            <>
              <span className="mr-2">Generating goal</span>
              <Comment
                visible={true}
                height="32"
                width="32"
                ariaLabel="comment-loading"
                wrapperStyle={{}}
                wrapperClass="comment-wrapper"
                color="#22c55e"
                backgroundColor="#FFF"
              />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function GoalTable({ plan }: { plan: any }) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-4xl">{plan.name}</div>
        <div>{plan.description}</div>
      </div>
      <div className="flex flex-col space-y-4">
        {Object.entries(plan.plan).map(([month, weeks]) => {
          return (
            <div key={month}>
              <div className="text-xl">{month}</div>
              <div className="flex flex-col space-y-2">
                {Object.values(
                  weeks as {
                    [key: string]: { milestone: string; focus: string };
                  }
                ).map((week, index) => (
                  <div>
                    <div className="flex space-x-2">
                      <div>Week {index + 1}: </div>
                      <div>{week.milestone}</div>
                    </div>
                    <div className="text-sm text-white/70">{week.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const GetStarted: NextPage = () => {
  const [queryInput, setQueryInput] = useState({
    sportId: "",
    startDate: new Date(),
    endDate: new Date(),
    goal: 0,
    unit: "km",
  });

  const [plan, setPlan] = useState<any>();
  const [error, setError] = useState<any>();
  const [gptError, setGptError] = useState<any>();

  const { refetch, isFetching } = api.goals.generateGoal.useQuery(queryInput, {
    retry: false,
    enabled: false,
    onError(err) {
      setError(error);
    },
    onSuccess(data) {
      console.log(data);
      setPlan(data.plan);
      setGptError(data.error);
    },
  });

  const handleOnSubmitGenerate = (input: GenerateQueryInput) => {
    setQueryInput(input);
  };

  useEffect(() => {
    if (queryInput.sportId != "") {
      refetch();
    }
  }, [queryInput]);

  const getBodyMarkup = () => {
    if (error) {
      return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (gptError) {
      return (
        <div>
          Error: <pre>{JSON.stringify(gptError, null, 2)}</pre>
        </div>
      );
    }

    if (plan) {
      return <GoalTable plan={plan} />;
    }

    return (
      <GoalForm onSubmit={handleOnSubmitGenerate} isFetching={isFetching} />
    );
  };

  return (
    <main className="flex min-h-full flex-col space-y-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] p-10 text-white ">
      <div className="mb-2">
        <h1 className="mb-4 text-4xl font-semibold">Let's get started</h1>
        <div className="flex items-center rounded-lg bg-green-500/30 p-4 py-3 text-white">
          <SparklesIcon className="mr-2 h-6 w-6" />{" "}
          {plan
            ? "Your AI generated milestones"
            : "Set your first AI generated goal"}
        </div>
      </div>
      <div className="flex-grow">{getBodyMarkup()}</div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <Button
          className="flex w-full justify-center"
          onClick={() => signOut()}
        >
          Skip goal setting
        </Button>
      </div>
    </main>
  );
};

export default GetStarted;
