const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div>
            <h3 className="fw-bold mb-4">Dashboard</h3>

            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Welcome</h6>
                            <h4>{user?.name || 'User'}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="fw-bold my-4">Statistics</h3>

            <div className="row">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Submitted Projects</h6>
                            <h4>0</h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Under Review</h6>
                            <h4>0</h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Changes Requested</h6>
                            <h4>0</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Approved Projects</h6>
                            <h4>0</h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h6 className="text-muted">Rejected Projects</h6>
                            <h4>0</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;