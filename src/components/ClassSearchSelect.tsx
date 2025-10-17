"use client";

import { useState, useRef, useEffect } from "react";

type Class = {
	id: number;
	name: string;
	capacity: number;
	_count: { students: number };
};

type ClassSearchSelectProps = {
	classes: Class[];
	value?: number;
	onChange: (value: number) => void;
	error?: string;
};

const ClassSearchSelect = ({
	classes,
	value,
	onChange,
	error,
}: ClassSearchSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState<Class | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Initialize selected class from value
	useEffect(() => {
		if (value && classes) {
			const classItem = classes.find((c) => c.id === value);
			setSelectedClass(classItem || null);
		}
	}, [value, classes]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Filter classes based on search term
	const filteredClasses = classes.filter((classItem) =>
		classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSelect = (classItem: Class) => {
		setSelectedClass(classItem);
		onChange(classItem.id);
		setIsOpen(false);
		setSearchTerm("");
	};

	const handleClear = () => {
		setSelectedClass(null);
		onChange(0);
		setSearchTerm("");
	};

	return (
		<div className="flex flex-col gap-2 w-full md:w-1/4" ref={wrapperRef}>
			<label className="text-xs text-gray-500">Class</label>
			<div className="relative">
				{/* Display selected class or search input */}
				<div
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full cursor-pointer bg-white flex items-center justify-between min-h-[40px]"
					onClick={() => setIsOpen(!isOpen)}
				>
					{selectedClass ? (
						<>
							<span className="flex-1">
								{selectedClass.name} - {selectedClass._count.students}/
								{selectedClass.capacity} Capacity
							</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClear();
								}}
								className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
							>
								✕
							</button>
						</>
					) : (
						<span className="text-gray-400">Search for a class...</span>
					)}
				</div>

				{/* Dropdown */}
				{isOpen && (
					<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
						{/* Search input inside dropdown */}
						<div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
							<input
								type="text"
								className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Search by class name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onClick={(e) => e.stopPropagation()}
								autoFocus
							/>
						</div>

						{/* Class list */}
						<div className="overflow-y-auto flex-1">
							{filteredClasses.length === 0 ? (
								<div className="p-3 text-sm text-gray-500 text-center">
									No classes found
								</div>
							) : (
								filteredClasses.map((classItem) => (
									<div
										key={classItem.id}
										className={`p-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 ${
											classItem._count.students >= classItem.capacity
												? "bg-red-50 text-red-600"
												: ""
										}`}
										onClick={() => handleSelect(classItem)}
									>
										<div className="flex justify-between items-center">
											<span className="font-medium">{classItem.name}</span>
											<span
												className={`text-xs px-2 py-1 rounded-full ${
													classItem._count.students >= classItem.capacity
														? "bg-red-100 text-red-700"
														: classItem._count.students / classItem.capacity >
														  0.8
														? "bg-yellow-100 text-yellow-700"
														: "bg-green-100 text-green-700"
												}`}
											>
												{classItem._count.students}/{classItem.capacity}
											</span>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}
			</div>

			{/* Error message */}
			{error && <p className="text-xs text-red-400">{error}</p>}
		</div>
	);
};

export default ClassSearchSelect;
