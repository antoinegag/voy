import React from "react";
import { api } from "../../utils/api";
import { ArrowRightIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import Button from "../Button";

export default function Content() {
  const goals = api.goals.getHabits.useQuery();

  return (
    <div>
      <h2 className="mb-2 flex items-center text-3xl font-bold">
        <RocketLaunchIcon className="mr-2 h-6 w-6" /> Your goals
      </h2>
      {goals.data?.length === 0 ? (
        <div>
          <div className="mb-2">No goals set yet,</div>
          <Button suffix={<ArrowRightIcon className="h-4 w-4" />}>
            Get started now
          </Button>
        </div>
      ) : (
        <div>{goals.data?.map((goal) => goal.title)}</div>
      )}
    </div>
  );
}
