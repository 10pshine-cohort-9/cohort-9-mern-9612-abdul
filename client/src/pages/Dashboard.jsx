import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import Header from '../components/Header';
import { getNotes, saveNotes } from '../utils/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchNotes = async () => {
      try {
        const savedNotes = getNotes();
        setNotes(savedNotes);
        if (savedNotes.length === 0) {
          saveNotes([]);
        }
      } catch (error) {
        console.error('Failed to fetch notes', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes/${noteId}/edit`);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  return (
    <div className="font-body-md text-body-md text-on-background antialiased flex h-screen overflow-hidden bg-[#fbf8fb]">
      <div className="flex-1 flex flex-col w-full">
        <Header>
          <button onClick={handleCreateNote} className="bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Note
          </button>
        </Header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1200px] mx-auto w-full">
          <div className="mb-xl flex justify-between items-start md:items-center">
            <div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">All Notes</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Your complete collection of thoughts and drafts.</p>
            </div>
          </div>
          
          {isLoading ? (
            <p className="text-on-surface-variant">Loading notes...</p>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-outline-variant rounded-lg">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">note_stack</span>
              <p className="text-on-surface-variant mb-6 font-body-md">No notes found. Create one to get started!</p>
              <button 
                onClick={handleCreateNote} 
                className="bg-primary-container text-on-primary font-label-md text-label-md py-sm px-lg rounded-sm hover:opacity-90 transition-opacity"
              >
                Create Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onClick={() => handleEditNote(note.id)} 
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
