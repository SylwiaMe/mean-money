import { useState, useEffect } from "react";
import { getDiaryEntries, deleteDiaryEntry } from "../services/diary_entry";
import ("./AllDiaryEntries.css") 

function AllDiaryEntries() {
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDiaryEntries = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Please log in to view your diary entries');
                    return;
                }

                const response = await getDiaryEntries(token);
                setDiaryEntries(response.entries || []);
                setError(null);
            } catch (err) {
            const errorMessage = err.message || 'Failed to load diary entries. Please try again later.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadDiaryEntries();
    }, []);

    if (isLoading) {
        return (
            <div className="loading-container">
                <p className="loading-text">Loading your entries...</p>
            </div>
        );
    }

    const handleDelete = async (entryId) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("No authentication token found. Please log in again.");
                    return;
                }

                await deleteDiaryEntry(token, entryId);
                window.location.reload();

            } catch (err) {
                console.error('Delete error:', err);
                setError(err.message || "Failed to delete entry. Please try again.");
            }
        }
    };

    return (
        <section className="diary-container">
        <header className="diary-header">
            <h1 className="diary-title">Your Diary Entries</h1>
        </header>

        {diaryEntries.length === 0 ? (
            <div className="empty-state">
                <p>No diary entries found.</p>
                <p className="empty-state-subtitle">Start adding entries to see them here!</p>
            </div>
        ) : (
            <div className="entries-container">
                {diaryEntries.map((entry) => (
                    <article key={entry._id} className="entry-card">
                        <h3 className="entry-title">
                            {entry.businessName}
                        </h3>
                        <div className="entry-details">
                            <p>
                                Amount: £{Number(entry.amount).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                            <p>Category: {entry.category}</p>
                            <p>
                                Date: {new Date(entry.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            </div>
                                    <div className="entry-actions">
                                        <button onClick={() => handleDelete(entry._id)} className="delete-button">
                                            Delete
                                        </button>
                                    </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default AllDiaryEntries;