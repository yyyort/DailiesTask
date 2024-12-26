"use client";

import { cn } from "@/lib/utils";

import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  UnderlineIcon,
  Undo,
} from "lucide-react";

import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";


export const Toolbar = (
    { editor }: { editor: Editor | undefined }
) => {

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="flex border border-input bg-transparent rounded-sm w-fit">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "",
            editor?.isActive("bold")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          )}
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          className={cn(
            "",
            editor.isActive("italic")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          )}
        >
          <Italic />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleUnderline().run()
          }
          className={cn(
            "",
            editor.isActive("underline")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          )}
        >
          <UnderlineIcon />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
          className={cn(
            "",
            editor.isActive("strike")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          )}
        >
          <Strikethrough />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
          className={
            editor.isActive("bulletList")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          }
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleOrderedList().run()
          }
          className={
            editor.isActive("orderedList")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          }
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleCodeBlock().run()
          }
          className={
            editor.isActive("code")
              ? "bg-slate-400 text-white"
              : "bg-transparent"
          }
        >
          <Code />
        </Toggle>
        <Button
          variant={"ghost"}
          size="sm"
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo />
        </Button>
        <Button
          variant={"ghost"}
          size="sm"
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo />
        </Button>
      </div>
    </>
  );
};

export default Toolbar;
