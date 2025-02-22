"use client";

import { ContributionReturnType } from "@/model/contribution.model";
import React from "react";
import { Button } from "../ui/button";

export default function ContributionsHeatmap({
  contributions,
}: {
  contributions: ContributionReturnType[];
}) {
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );

  const totalTasksDone = contributions.reduce((acc, c) => acc + c.tasksDone, 0);
  const currentYear = new Date().getFullYear();

  // Helper functions to replace date-fns
  const getDaysInYear = (year: number) => {
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return isLeapYear ? 366 : 365;
  };

  const formatDate = (date: Date): string => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Generate all dates for the year
  const generateDates = () => {
    const dates: Date[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const totalDays = getDaysInYear(selectedYear);

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const allDates = generateDates();

  // Group dates by week
  const weeks = allDates.reduce((acc: Date[][], date, i) => {
    const weekIndex = Math.floor(i / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = [];
    }
    acc[weekIndex].push(date);
    return acc;
  }, []);

  // Get contribution level for a date, based on tasks done
  const getContributionLevel = (date: Date) => {
    const contribution = contributions.find((c) =>
      isSameDay(new Date(c.date), date)
    );

    if (!contribution) return 0;

    const tasksDone = contribution.tasksDone;

    if (tasksDone >= 7) return 4;
    if (tasksDone >= 5) return 3;
    if (tasksDone >= 3) return 2;
    if (tasksDone > 0) return 1;

    return 0;
  };

  const getTasksDone = (date: Date): number => {
    const contribution = contributions.find((c) =>
      isSameDay(new Date(c.date), date)
    );

    if (!contribution) return 0;

    return contribution.tasksDone;
  };

  // Get color based on contribution level
  const getColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-green-800";
      case 3:
        return "bg-green-600";
      case 2:
        return "bg-green-400";
      case 1:
        return "bg-green-200";
      default:
        return "bg-gray-100";
    }
  };

  // Calculate the position of month labels
  const getMonthLabels = () => {
    const monthLabels: { name: string; index: number }[] = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      week.forEach((date) => {
        if (date.getMonth() !== currentMonth) {
          currentMonth = date.getMonth();
          monthLabels.push({
            name: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ][currentMonth],
            index: weekIndex,
          });
        }
      });
    });

    return monthLabels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div
      className="p-4
    phone-sm:min-w-[280px] 
    phone:min-w-[440px] 
    tablet:min-w-[600px] 
    laptop:w-[340px]
    desktop:w-[800px]
    2k:w-full 2k:max-w-full
    overflow-auto"
    >
      <div className="flex items-center gap-2">
        <div>
          {/* header */}
          <div>
            <h1
              className="
          laptop:text-2xl font-medium pl-7 pb-5
          "
            >
              {totalTasksDone} tasks done this year
            </h1>
          </div>
          <div className="flex">
            <div className="w-8" /> {/* Spacer for alignment with grid */}
            <div
              className="relative w-full text-gray-500 mb-5 pl-2 pb-2
        phone-sm:text-sm 
        "
            >
              {monthLabels.map((month, index) => (
                <span
                  key={index}
                  className="absolute"
                  style={{
                    left: `${month.index * 16 + month.index * 4}px`, // 16px for square + 4px gap
                  }}
                >
                  {month.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex">
            <div
              className="flex flex-col justify-around text-gray-500 mr-2
            phone-sm:text-sm
        "
            >
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date, dateIndex) => {
                    const level = getContributionLevel(date);
                    const tasksDone = getTasksDone(date);
                    return (
                      <div
                        key={dateIndex}
                        className={`rounded-sm ${getColor(
                          level
                        )} hover:ring-1 hover:ring-black/20
                    phone-sm:w-4 phone-sm:h-4
                    `}
                        title={`${formatDate(date)}: ${
                          level === 0 ? "No" : tasksDone
                        } Tasks done${tasksDone !== 1 ? "s" : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="text-gray-500">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-4 h-4 rounded-sm ${getColor(level)}`}
              />
            ))}
            <span className="text-gray-500">More</span>
          </div>
        </div>

        {/* years */}
        <div className="flex flex-col gap-2 ml-4">
          <Button
            variant={selectedYear === currentYear ? "default" : "outline"}
            className=""
            onClick={() => setSelectedYear(currentYear)}
          >
            {currentYear}
          </Button>
          <Button
            variant={selectedYear === currentYear - 1 ? "default" : "outline"}
            className=""
            onClick={() => setSelectedYear(currentYear - 1)}
          >
            {currentYear - 1}
          </Button>
          <Button
            variant={selectedYear === currentYear - 2 ? "default" : "outline"}
            className=""
            onClick={() => setSelectedYear(currentYear - 2)}
          >
            {currentYear - 2}
          </Button>
        </div>
      </div>
    </div>
  );
}
