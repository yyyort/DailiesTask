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

export const Toolbar = ({ editor }: { editor: Editor | undefined }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="flex border border-input rounded-sm w-fit">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            editor?.isActive("bold") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
          )}
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          className={cn(
            editor?.isActive("italic") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
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
            editor?.isActive("underline") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
          )}
        >
          <UnderlineIcon />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
          className={cn(
            editor?.isActive("strike") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
          )}
        >
          <Strikethrough />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
          className={cn(
            editor?.isActive("bulletList") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
          )}
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleOrderedList().run()
          }
          className={cn(
            editor?.isActive("orderedList") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
          )}
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().toggleCodeBlock().run()
          }
          className={cn(
            editor?.isActive("code") ? "bg-primary" : "bg-transparent",
            "data-[state=on]:bg-primary"
          )}
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
