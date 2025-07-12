import React, { useState } from "react";
import { Filter, Search, X } from "lucide-react";

const AlertFilters = ({ filters, setFilters }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setFilters((prev) => ({
            ...prev,
            search: e.target.value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            severity: "all",
            timeRange: "24h",
            zone: "all",
            soundType: "all",
            search: "",
        });
        setSearchTerm("");
    };

    const activeFiltersCount = Object.values(filters).filter(
        (value) => value !== "all" && value !== "24h" && value !== ""
    ).length;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filter Alerts
                    {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {activeFiltersCount} active
                        </span>
                    )}
                </h3>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search alerts..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#95D5B2] focus:border-transparent"
                    />
                </div>

                {/* Severity Filter */}
                <select
                    value={filters.severity}
                    onChange={(e) =>
                        handleFilterChange("severity", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#95D5B2] focus:border-transparent"
                >
                    <option value="all">All Severities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                {/* Time Range Filter */}
                <select
                    value={filters.timeRange}
                    onChange={(e) =>
                        handleFilterChange("timeRange", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#95D5B2] focus:border-transparent"
                >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>

                {/* Zone Filter */}
                <select
                    value={filters.zone}
                    onChange={(e) => handleFilterChange("zone", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#95D5B2] focus:border-transparent"
                >
                    <option value="all">All Zones</option>
                    <option value="A">Zone A</option>
                    <option value="B">Zone B</option>
                    <option value="C">Zone C</option>
                </select>

                {/* Sound Type Filter */}
                <select
                    value={filters.soundType}
                    onChange={(e) =>
                        handleFilterChange("soundType", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#95D5B2] focus:border-transparent"
                >
                    <option value="all">All Sound Types</option>
                    <option value="chainsaw">Chainsaw</option>
                    <option value="machinery">Heavy Machinery</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="gunshot">Gunshot</option>
                </select>
            </div>
        </div>
    );
};

export default AlertFilters;
