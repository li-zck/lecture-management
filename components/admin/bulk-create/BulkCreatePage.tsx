"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  downloadCSVTemplate,
  parseContent,
  parseFile,
  transformToApiFormat,
  validateData,
} from "./csv-parser";
import type { BulkCreateConfig, ParsedRow, RowValidationError } from "./types";

type TabType = "csv" | "form" | "paste";

interface BulkCreatePageProps {
  config: BulkCreateConfig;
  onSubmit: (data: Record<string, unknown>[]) => Promise<{ created: number }>;
  onSuccess?: () => void;
}

function createEmptyRow(cfg: BulkCreateConfig): ParsedRow {
  const row: ParsedRow = {};
  for (const field of cfg.fields) {
    row[field.name] = field.defaultValue ?? null;
  }
  return row;
}

export function BulkCreatePage({
  config,
  onSubmit,
  onSuccess,
}: BulkCreatePageProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.bulkCreate;
  const [activeTab, setActiveTab] = useState<TabType>("csv");
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<RowValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form-based entries
  const [formRows, setFormRows] = useState<ParsedRow[]>(() => [
    createEmptyRow(config),
  ]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const { data } = await parseFile(file);
        setParsedData(data);

        // Validate
        const validationErrors = validateData(data, config);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
          toast.success(
            `${t.parsed} ${data.length} ${config.entityNamePlural.toLowerCase()}`,
          );
        } else {
          toast.warning(
            `${t.parsed} ${data.length} ${t.rows} — ${validationErrors.length} ${t.validationErrors}`,
          );
        }
      } catch (error) {
        toast.error(t.parseFailed);
        console.error(error);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [config, t.parseFailed, t.parsed, t.rows, t.validationErrors],
  );

  const handlePasteData = useCallback(() => {
    if (!pasteContent.trim()) {
      toast.error(t.pasteFirst);
      return;
    }

    const { data } = parseContent(pasteContent);
    setParsedData(data);

    // Validate
    const validationErrors = validateData(data, config);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      toast.success(
        `${t.parsed} ${data.length} ${config.entityNamePlural.toLowerCase()}`,
      );
    } else {
      toast.warning(
        `${t.parsed} ${data.length} ${t.rows} — ${validationErrors.length} ${t.validationErrors}`,
      );
    }
  }, [
    pasteContent,
    config,
    t.parsed,
    t.rows,
    t.validationErrors,
    t.pasteFirst,
  ]);

  const handleFormRowChange = useCallback(
    (rowIndex: number, fieldName: string, value: string) => {
      setFormRows((prev) => {
        const newRows = [...prev];
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          [fieldName]: value || null,
        };
        return newRows;
      });
    },
    [],
  );

  const addFormRow = useCallback(() => {
    setFormRows((prev) => [...prev, createEmptyRow(config)]);
  }, [config]);

  const removeFormRow = useCallback((index: number) => {
    setFormRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    let dataToSubmit: ParsedRow[] = [];

    if (activeTab === "form") {
      // Validate form rows
      const validationErrors = validateData(formRows, config);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        toast.error(t.fixErrors);
        return;
      }
      dataToSubmit = formRows;
    } else {
      if (parsedData.length === 0) {
        toast.error(t.noData);
        return;
      }
      if (errors.length > 0) {
        toast.error(t.fixErrors);
        return;
      }
      dataToSubmit = parsedData;
    }

    // Filter out empty rows
    dataToSubmit = dataToSubmit.filter((row) =>
      Object.values(row).some((v) => v !== null && v !== ""),
    );

    if (dataToSubmit.length === 0) {
      toast.error(t.noValidData);
      return;
    }

    setIsSubmitting(true);
    try {
      const apiData = transformToApiFormat(dataToSubmit, config);
      const result = await onSubmit(apiData);
      toast.success(
        `${t.successCreated} ${result.created} ${config.entityNamePlural.toLowerCase()}`,
      );

      // Reset state
      setParsedData([]);
      setFormRows([createEmptyRow(config)]);
      setPasteContent("");
      setErrors([]);

      onSuccess?.();
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || t.failedCreate);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    activeTab,
    formRows,
    parsedData,
    errors,
    config,
    onSubmit,
    onSuccess,
    t.failedCreate,
    t.noData,
    t.successCreated,
    t.fixErrors,
    t.noValidData,
  ]);

  const getRowErrors = (rowIndex: number) => {
    return errors.filter((e) => e.rowIndex === rowIndex);
  };

  const clearData = () => {
    setParsedData([]);
    setErrors([]);
    setPasteContent("");
  };

  const tabs = useMemo(
    () => [
      { id: "csv" as const, label: t.csvUpload, icon: Upload },
      { id: "form" as const, label: t.multiRowForm, icon: FileSpreadsheet },
      { id: "paste" as const, label: t.pasteData, icon: ClipboardPaste },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* CSV Upload Tab */}
      {activeTab === "csv" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {t.uploadCsv}
            </CardTitle>
            <CardDescription>
              {t.uploadDescription.replace(
                "{entity}",
                config.entityNamePlural.toLowerCase(),
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => downloadCSVTemplate(config)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t.downloadTemplate}
              </Button>
              <div className="flex-1">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {parsedData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {parsedData.length} {t.rowsLoaded}
                    </Badge>
                    {errors.length > 0 ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.length} {t.errors}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 text-emerald-600"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {t.valid}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearData}>
                    <X className="h-4 w-4 mr-1" />
                    {t.clear}
                  </Button>
                </div>

                <DataPreviewTable
                  data={parsedData}
                  config={config}
                  getRowErrors={getRowErrors}
                  t={t}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Multi-Row Form Tab */}
      {activeTab === "form" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              {t.multiRowTitle}
            </CardTitle>
            <CardDescription>
              {t.multiRowDescription.replace(
                "{entity}",
                config.entityNamePlural.toLowerCase(),
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    {config.fields
                      .filter((f) => f.required || f.name !== "departmentId")
                      .slice(0, 6)
                      .map((field) => (
                        <TableHead key={field.name}>
                          {field.label}
                          {field.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </TableHead>
                      ))}
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex.toString()}>
                      <TableCell className="text-muted-foreground">
                        {rowIndex}
                      </TableCell>
                      {config.fields
                        .filter((f) => f.required || f.name !== "departmentId")
                        .slice(0, 6)
                        .map((field) => (
                          <TableCell key={field.name}>
                            {field.type === "select" && field.options ? (
                              <Select
                                value={String(row[field.name] ?? "")}
                                onValueChange={(value) =>
                                  handleFormRowChange(
                                    rowIndex,
                                    field.name,
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder={t.select} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={
                                  field.type === "password"
                                    ? "password"
                                    : field.type === "email"
                                      ? "email"
                                      : "text"
                                }
                                value={String(row[field.name] ?? "")}
                                onChange={(e) =>
                                  handleFormRowChange(
                                    rowIndex,
                                    field.name,
                                    e.target.value,
                                  )
                                }
                                placeholder={field.placeholder}
                                className="h-8 text-sm"
                              />
                            )}
                          </TableCell>
                        ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFormRow(rowIndex)}
                          disabled={formRows.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button variant="outline" onClick={addFormRow} className="gap-2">
              <Plus className="h-4 w-4" />
              {t.addRow}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Paste Data Tab */}
      {activeTab === "paste" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardPaste className="h-5 w-5" />
              {t.pasteTitle}
            </CardTitle>
            <CardDescription>
              {t.pasteDescription}{" "}
              <code className="text-xs bg-muted px-1 rounded">
                {config.csvTemplate.slice(0, 5).join(", ")}
                {config.csvTemplate.length > 5 && ", ..."}
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full h-48 p-3 text-sm font-mono border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={`${t.pastePlaceholder}\n\nExample (tab-separated):\n${config.csvTemplate.join("\t")}\n${config.exampleData[0] ? Object.values(config.exampleData[0]).join("\t") : ""}`}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
            />

            <div className="flex gap-4">
              <Button onClick={handlePasteData} className="gap-2">
                <ClipboardPaste className="h-4 w-4" />
                {t.parseData}
              </Button>
              {pasteContent && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPasteContent("");
                    clearData();
                  }}
                >
                  {t.clear}
                </Button>
              )}
            </div>

            {parsedData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {parsedData.length} {t.rowsParsed}
                  </Badge>
                  {errors.length > 0 ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.length} {t.errors}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      {t.valid}
                    </Badge>
                  )}
                </div>

                <DataPreviewTable
                  data={parsedData}
                  config={config}
                  getRowErrors={getRowErrors}
                  t={t}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            (activeTab !== "form" && parsedData.length === 0) ||
            (activeTab !== "form" && errors.length > 0)
          }
        >
          {isSubmitting
            ? t.creating
            : `${dict.admin.common.create} ${activeTab === "form" ? formRows.length : parsedData.length} ${config.entityNamePlural}`}
        </Button>
      </div>
    </div>
  );
}

/**
 * Data preview table component
 */
function DataPreviewTable({
  data,
  config,
  getRowErrors,
  t,
}: {
  data: ParsedRow[];
  config: BulkCreateConfig;
  getRowErrors: (rowIndex: number) => RowValidationError[];
  t: Record<string, string>;
}) {
  const displayFields = config.fields.slice(0, 6);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              {displayFields.map((field) => (
                <TableHead key={field.name}>{field.label}</TableHead>
              ))}
              <TableHead className="w-20">{t.valid}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 50).map((row, index: number) => {
              const rowErrors = getRowErrors(index);
              const hasError = rowErrors.length > 0;

              return (
                <TableRow
                  key={index.toString()}
                  className={hasError ? "bg-destructive/5" : ""}
                >
                  <TableCell className="text-muted-foreground">
                    {index}
                  </TableCell>
                  {displayFields.map((field) => (
                    <TableCell
                      key={field.name}
                      className={
                        rowErrors.some((e) => e.field === field.name)
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {field.type === "password"
                        ? "••••••"
                        : String(row[field.name] ?? "-")}
                    </TableCell>
                  ))}
                  <TableCell>
                    {hasError ? (
                      <Badge
                        variant="destructive"
                        className="text-xs"
                        title={rowErrors.map((e) => e.message).join(", ")}
                      >
                        {t.errors}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        OK
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {data.length > 50 && (
        <div className="p-2 text-center text-sm text-muted-foreground bg-muted/50">
          {t.showingFirst} {data.length} {t.rows}
        </div>
      )}
    </div>
  );
}
