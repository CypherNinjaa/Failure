"use client";

import { useState, useRef, useEffect } from "react";

type Parent = {
	id: string;
	name: string;
	surname: string;
};

type ParentSearchSelectProps = {
	parents: Parent[];
	value?: string;
	onChange: (value: string) => void;
	error?: string;
};

const ParentSearchSelect = ({
	parents,
	value,
	onChange,
	error,
}: ParentSearchSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Initialize selected parent from value
	useEffect(() => {
		if (value && parents) {
			const parent = parents.find((p) => p.id === value);
			setSelectedParent(parent || null);
		}
	}, [value, parents]);

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

	// Filter parents based on search term
	const filteredParents = parents.filter(
		(parent) =>
			parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			parent.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			`${parent.name} ${parent.surname}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
	);

	const handleSelect = (parent: Parent) => {
		setSelectedParent(parent);
		onChange(parent.id);
		setIsOpen(false);
		setSearchTerm("");
	};

	const handleClear = () => {
		setSelectedParent(null);
		onChange("");
		setSearchTerm("");
	};

	return (
		<div className="flex flex-col gap-2 w-full md:w-1/4" ref={wrapperRef}>
			<label className="text-xs text-gray-500">Parent</label>
			<div className="relative">
				{/* Display selected parent or search input */}
				<div
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full cursor-pointer bg-white flex items-center justify-between"
					onClick={() => setIsOpen(!isOpen)}
				>
					{selectedParent ? (
						<>
							<span>
								{selectedParent.name} {selectedParent.surname}
							</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClear();
								}}
								className="text-gray-400 hover:text-gray-600 ml-2"
							>
								✕
							</button>
						</>
					) : (
						<span className="text-gray-400">Search for a parent...</span>
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
								placeholder="Search by name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onClick={(e) => e.stopPropagation()}
								autoFocus
							/>
						</div>

						{/* Parent list */}
						<div className="overflow-y-auto flex-1">
							{filteredParents.length === 0 ? (
								<div className="p-3 text-sm text-gray-500 text-center">
									No parents found
								</div>
							) : (
								filteredParents.map((parent) => (
									<div
										key={parent.id}
										className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
										onClick={() => handleSelect(parent)}
									>
										{parent.name} {parent.surname}
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

export default ParentSearchSelect;
