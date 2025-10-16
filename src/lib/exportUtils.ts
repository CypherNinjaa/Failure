/**
 * Export Utilities
 * Helper functions for exporting data to Excel format
 */

import * as XLSX from "xlsx";

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (date: Date | string | null): string => {
	if (!date) return "";
	const d = new Date(date);
	if (isNaN(d.getTime())) return "";
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
};

/**
 * Format date with time to DD/MM/YYYY HH:MM
 */
export const formatDateTime = (date: Date | string | null): string => {
	if (!date) return "";
	const d = new Date(date);
	if (isNaN(d.getTime())) return "";
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Convert boolean to Yes/No
 */
export const boolToYesNo = (value: boolean | null | undefined): string => {
	if (value === null || value === undefined) return "";
	return value ? "Yes" : "No";
};

/**
 * Get file name with timestamp
 */
export const getExportFileName = (
	baseName: string,
	extension: string = "xlsx"
): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	return `${baseName}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.${extension}`;
};

/**
 * Apply Excel styling to worksheet
 */
export const styleWorksheet = (worksheet: XLSX.WorkSheet, data: any[]) => {
	const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

	// Style header row (bold, background color)
	for (let col = range.s.c; col <= range.e.c; col++) {
		const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
		if (!worksheet[cellAddress]) continue;

		worksheet[cellAddress].s = {
			font: { bold: true, color: { rgb: "FFFFFF" } },
			fill: { fgColor: { rgb: "4472C4" } },
			alignment: { horizontal: "center", vertical: "center" },
			border: {
				top: { style: "thin", color: { rgb: "000000" } },
				bottom: { style: "thin", color: { rgb: "000000" } },
				left: { style: "thin", color: { rgb: "000000" } },
				right: { style: "thin", color: { rgb: "000000" } },
			},
		};
	}

	// Auto-width columns
	const colWidths: { wch: number }[] = [];
	for (let col = range.s.c; col <= range.e.c; col++) {
		let maxWidth = 10;

		for (let row = range.s.r; row <= range.e.r; row++) {
			const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
			const cell = worksheet[cellAddress];
			if (cell && cell.v) {
				const cellValue = String(cell.v);
				maxWidth = Math.max(maxWidth, cellValue.length);
			}
		}

		colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
	}

	worksheet["!cols"] = colWidths;

	return worksheet;
};

/**
 * Export data to Excel file
 */
export const exportToExcel = (
	data: any[],
	fileName: string,
	sheetName: string = "Sheet1"
) => {
	if (data.length === 0) {
		alert("No data to export");
		return;
	}

	// Create workbook and worksheet
	const worksheet = XLSX.utils.json_to_sheet(data);

	// Apply styling
	styleWorksheet(worksheet, data);

	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

	// Generate file name with timestamp
	const exportFileName = getExportFileName(fileName);

	// Download file
	XLSX.writeFile(workbook, exportFileName);
};

/**
 * Export multiple sheets to Excel
 */
export const exportMultipleSheets = (
	sheets: { name: string; data: any[] }[],
	fileName: string
) => {
	if (sheets.length === 0 || sheets.every((s) => s.data.length === 0)) {
		alert("No data to export");
		return;
	}

	const workbook = XLSX.utils.book_new();

	sheets.forEach((sheet) => {
		if (sheet.data.length > 0) {
			const worksheet = XLSX.utils.json_to_sheet(sheet.data);
			styleWorksheet(worksheet, sheet.data);
			XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
		}
	});

	const exportFileName = getExportFileName(fileName);
	XLSX.writeFile(workbook, exportFileName);
};

/**
 * Date range filter options
 */
export type DateRange =
	| "all"
	| "today"
	| "yesterday"
	| "this_week"
	| "last_week"
	| "this_month"
	| "last_month"
	| "this_year"
	| "last_year"
	| "custom";

/**
 * Get date range based on selection
 */
export const getDateRange = (
	range: DateRange,
	customStart?: Date,
	customEnd?: Date
): { start: Date; end: Date } | null => {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	switch (range) {
		case "all":
			return null;

		case "today":
			return {
				start: today,
				end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
			};

		case "yesterday": {
			const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
			return {
				start: yesterday,
				end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
			};
		}

		case "this_week": {
			const dayOfWeek = today.getDay();
			const monday = new Date(
				today.getTime() -
					(dayOfWeek === 0 ? 6 : dayOfWeek - 1) * 24 * 60 * 60 * 1000
			);
			return {
				start: monday,
				end: new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
			};
		}

		case "last_week": {
			const dayOfWeek = today.getDay();
			const lastMonday = new Date(
				today.getTime() -
					(dayOfWeek === 0 ? 6 : dayOfWeek - 1) * 24 * 60 * 60 * 1000 -
					7 * 24 * 60 * 60 * 1000
			);
			return {
				start: lastMonday,
				end: new Date(lastMonday.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
			};
		}

		case "this_month":
			return {
				start: new Date(now.getFullYear(), now.getMonth(), 1),
				end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
			};

		case "last_month":
			return {
				start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
				end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
			};

		case "this_year":
			return {
				start: new Date(now.getFullYear(), 0, 1),
				end: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
			};

		case "last_year":
			return {
				start: new Date(now.getFullYear() - 1, 0, 1),
				end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59),
			};

		case "custom":
			if (customStart && customEnd) {
				return { start: customStart, end: customEnd };
			}
			return null;

		default:
			return null;
	}
};
