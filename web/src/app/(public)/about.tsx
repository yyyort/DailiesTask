import React from "react";

export default function About() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center
    phone-sm:p-10 phone-sm:my-40
    2k:p-10 2k:my-4
    ">
      {/* card */}
      <div
        className=" border-y-2 border-primary rounded-lg h-fit flex flex-col gap-40 items-center justify-center
        phone-sm:w-fit phone-sm:p-10
        2k:w-1/2 2k:p-10
      "
      >
        {/* about the project */}

        <div className="flex flex-col gap-5 items-start">
          <h1 className="text-3xl font-semibold">
            About
            <span className="text-primary"> DailiesTask</span>
          </h1>
          <p className="text-lg">
            DailiesTask is a task management, routine tracking, and note-taking
            application. It is designed to help you manage your daily tasks,
            track your routines, and take notes.
          </p>

          <p className="text-lg">
            DailiesTask is an open-source project you can see the source code on
            <a
              href="https://github.com/yyyort/DailiesTask"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              {" "}
              github.com/yyyort/DailiesTask
            </a>
          </p>
        </div>

        {/* about developer */}
        <div className="flex flex-col gap-5 items-end">
          <h1 className="text-3xl font-semibold">About Developer</h1>
          <p className="text-lg">
            DailiesTask is developed by me{"  "}
            <a
              href="https://github.com/yyyort"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              Ian Troy Pahilga
            </a>
            .
          </p>

          <p className="text-lg">
            The main purpose of this project is to showcase my skills in
            Full-Stack Development and to make a tool for my personal use.
          </p>

          <p className="text-lg">
            The app is currently fully functional but not fully developed so
            keep risk in mind. Feel free to fork or clone the project and
            customize it to your own needs the only thing I ask is to please star it on
            github 🤩.
          </p>
        </div>
      </div>
    </div>
  );
}
