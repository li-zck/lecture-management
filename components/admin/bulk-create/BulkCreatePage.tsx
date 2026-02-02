"use client";

import { useState, useCallback, useRef } from "react";
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
import { toast } from "sonner";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Badge } from "@/components/ui/shadcn/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/shadcn/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/shadcn/select";
import type { BulkCreateConfig, ParsedRow, RowValidationError } from "./types";
import {
	parseContent,
	parseFile,
	validateData,
	transformToApiFormat,
	downloadCSVTemplate,
} from "./csv-parser";

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
						`Parsed ${data.length} ${config.entityNamePlural.toLowerCase()}`,
					);
				} else {
					toast.warning(
						`Parsed ${data.length} rows with ${validationErrors.length} validation errors`,
					);
				}
			} catch (error) {
				toast.error("Failed to parse CSV file");
				console.error(error);
			}

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[config],
	);

	const handlePasteData = useCallback(() => {
		if (!pasteContent.trim()) {
			toast.error("Please paste some data first");
			return;
		}

		const { data } = parseContent(pasteContent);
		setParsedData(data);

		// Validate
		const validationErrors = validateData(data, config);
		setErrors(validationErrors);

		if (validationErrors.length === 0) {
			toast.success(
				`Parsed ${data.length} ${config.entityNamePlural.toLowerCase()}`,
			);
		} else {
			toast.warning(
				`Parsed ${data.length} rows with ${validationErrors.length} validation errors`,
			);
		}
	}, [pasteContent, config]);

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
				toast.error("Please fix validation errors before submitting");
				return;
			}
			dataToSubmit = formRows;
		} else {
			if (parsedData.length === 0) {
				toast.error("No data to submit");
				return;
			}
			if (errors.length > 0) {
				toast.error("Please fix validation errors before submitting");
				return;
			}
			dataToSubmit = parsedData;
		}

		// Filter out empty rows
		dataToSubmit = dataToSubmit.filter((row) =>
			Object.values(row).some((v) => v !== null && v !== ""),
		);

		if (dataToSubmit.length === 0) {
			toast.error("No valid data to submit");
			return;
		}

		setIsSubmitting(true);
		try {
			const apiData = transformToApiFormat(dataToSubmit, config);
			const result = await onSubmit(apiData);
			toast.success(
				`Successfully created ${result.created} ${config.entityNamePlural.toLowerCase()}`,
			);

			// Reset state
			setParsedData([]);
			setFormRows([createEmptyRow(config)]);
			setPasteContent("");
			setErrors([]);

			onSuccess?.();
		} catch (error) {
			const err = error as { message?: string };
			toast.error(err.message || "Failed to create records");
		} finally {
			setIsSubmitting(false);
		}
	}, [activeTab, formRows, parsedData, errors, config, onSubmit, onSuccess]);

	const getRowErrors = (rowIndex: number) => {
		return errors.filter((e) => e.rowIndex === rowIndex);
	};

	const clearData = () => {
		setParsedData([]);
		setErrors([]);
		setPasteContent("");
	};

	const tabs = [
		{ id: "csv" as const, label: "CSV Upload", icon: Upload },
		{ id: "form" as const, label: "Multi-Row Form", icon: FileSpreadsheet },
		{ id: "paste" as const, label: "Paste Data", icon: ClipboardPaste },
	];

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
							Upload CSV File
						</CardTitle>
						<CardDescription>
							Upload a CSV file with {config.entityNamePlural.toLowerCase()}{" "}
							data. Download the template to see the required format.
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
								Download Template
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
											{parsedData.length} rows loaded
										</Badge>
										{errors.length > 0 ? (
											<Badge variant="destructive" className="gap-1">
												<AlertCircle className="h-3 w-3" />
												{errors.length} errors
											</Badge>
										) : (
											<Badge
												variant="outline"
												className="gap-1 text-emerald-600"
											>
												<CheckCircle2 className="h-3 w-3" />
												Valid
											</Badge>
										)}
									</div>
									<Button variant="ghost" size="sm" onClick={clearData}>
										<X className="h-4 w-4 mr-1" />
										Clear
									</Button>
								</div>

								<DataPreviewTable
									data={parsedData}
									config={config}
									getRowErrors={getRowErrors}
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
							Multi-Row Form
						</CardTitle>
						<CardDescription>
							Add multiple {config.entityNamePlural.toLowerCase()} manually
							using the form below.
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
																	<SelectValue placeholder="Select..." />
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
							Add Row
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
							Paste from Spreadsheet
						</CardTitle>
						<CardDescription>
							Copy data from Excel or Google Sheets and paste it below. The
							first row should contain headers matching:{" "}
							<code className="text-xs bg-muted px-1 rounded">
								{config.csvTemplate.slice(0, 5).join(", ")}
								{config.csvTemplate.length > 5 && ", ..."}
							</code>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<textarea
							className="w-full h-48 p-3 text-sm font-mono border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
							placeholder={`Paste your data here...\n\nExample (tab-separated):\n${config.csvTemplate.join("\t")}\n${config.exampleData[0] ? Object.values(config.exampleData[0]).join("\t") : ""}`}
							value={pasteContent}
							onChange={(e) => setPasteContent(e.target.value)}
						/>

						<div className="flex gap-4">
							<Button onClick={handlePasteData} className="gap-2">
								<ClipboardPaste className="h-4 w-4" />
								Parse Data
							</Button>
							{pasteContent && (
								<Button
									variant="ghost"
									onClick={() => {
										setPasteContent("");
										clearData();
									}}
								>
									Clear
								</Button>
							)}
						</div>

						{parsedData.length > 0 && (
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Badge variant="secondary">
										{parsedData.length} rows parsed
									</Badge>
									{errors.length > 0 ? (
										<Badge variant="destructive" className="gap-1">
											<AlertCircle className="h-3 w-3" />
											{errors.length} errors
										</Badge>
									) : (
										<Badge variant="outline" className="gap-1 text-emerald-600">
											<CheckCircle2 className="h-3 w-3" />
											Valid
										</Badge>
									)}
								</div>

								<DataPreviewTable
									data={parsedData}
									config={config}
									getRowErrors={getRowErrors}
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
						? "Creating..."
						: `Create ${activeTab === "form" ? formRows.length : parsedData.length} ${config.entityNamePlural}`}
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
}: {
	data: ParsedRow[];
	config: BulkCreateConfig;
	getRowErrors: (rowIndex: number) => RowValidationError[];
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
							<TableHead className="w-20">Status</TableHead>
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
												Error
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
					Showing first 50 of {data.length} rows
				</div>
			)}
		</div>
	);
}
