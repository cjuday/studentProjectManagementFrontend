type Props = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    statusFilter: string;
    setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
    onFilter: () => void;
    onClear: () => void;
};

const ProjectFilters = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onFilter,
    onClear
}: Props) => {
    return (
        <div className="container-fluid mt-3">
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by project, student or teacher"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="0">Pending</option>
                        <option value="1">Under Review</option>
                        <option value="2">Need Changes</option>
                        <option value="3">Approved</option>
                        <option value="4">Rejected</option>
                    </select>
                </div>

                <div className="col-md-2 d-flex gap-2">
                    <button className="btn btn-primary w-50" onClick={onFilter}>
                        Filter
                    </button>

                    <button className="btn btn-outline-secondary w-50" onClick={onClear}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;