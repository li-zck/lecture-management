"use client";

import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value = "",
  onChange,
  minHeight = "200px",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[120px] px-3 py-2 [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_strong]:font-bold [&_em]:italic",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : html);
    },
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!editor) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const currentHtml = editor.getHTML();
    const normalizedValue = value || "<p></p>";
    if (currentHtml !== normalizedValue) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return (
    <div
      className={cn(
        "rounded-md border bg-background text-foreground",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      style={{ minHeight }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
