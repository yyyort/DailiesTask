"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { forwardRef } from "react";
import React from "react";
import Toolbar from "./toolbar";

export const Tiptap = forwardRef(
  (
    {
      content,
      onChange,
    }: // eslint-disable-next-line no-unused-vars
    { content: string; onChange: (richText: string) => void },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const editor = useEditor({
      extensions: [StarterKit.configure({}), Underline],
      content: content,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose min-w-full h-[42rem] max-h-[42rem] overflow-auto text-foreground p-4 rounded-lg shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        },
      },
      onUpdate({ editor }) {
        onChange(editor.getHTML());
      },
    });

    if (!editor) {
      return null;
    }

    return (
      <>
        <div className="">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} ref={ref} />
        </div>
      </>
    );
  }
);

// Set displayName for debugging purposes
Tiptap.displayName = "Tiptap";
