"use client";

import { ContributionReturnType } from "@/model/contribution.model";
import React from "react";

export default function ContributionsHeatmap({
  contributions,
}: {
  contributions: ContributionReturnType[];
}) {
  const currentYear = new Date().getFullYear();
  const totalTasksDone = contributions.reduce((acc, c) => acc + c.tasksDone, 0);

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
    const startDate = new Date(currentYear, 0, 1);
    const totalDays = getDaysInYear(currentYear);

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

  // Get contribution level for a date
  const getContributionLevel = (date: Date) => {
    const contribution = contributions.find((c) =>
      isSameDay(new Date(c.createdAt), date)
    );

    if (!contribution) return 0;

    const completionRate = contribution.tasksDone / contribution.tasksTotal;

    if (completionRate >= 0.8) return 4;
    if (completionRate >= 0.6) return 3;
    if (completionRate >= 0.4) return 2;
    if (completionRate > 0) return 1;
    return 0;
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
    <div className="p-4 min-w-[1000px] phone-sm:min-w-[280px] phone:min-w-[440px] tablet:min-w-[600px] overflow-auto">
      {/* header */}
      <div>
        <h1
          className="
          laptop:text-2xl font-medium pl-7 pb-5
          "
        >{totalTasksDone} tasks done this year</h1>
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
                return (
                  <div
                    key={dateIndex}
                    className={`rounded-sm ${getColor(
                      level
                    )} hover:ring-1 hover:ring-black/20
                    phone-sm:w-4 phone-sm:h-4
                    `}
                    title={`${formatDate(date)}: ${
                      level === 0 ? "No" : level
                    } contribution${level !== 1 ? "s" : ""}`}
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
  );
}
