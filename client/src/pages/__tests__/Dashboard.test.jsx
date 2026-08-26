import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { fetchNotes, deleteNote } from '../../services/notesService';
import { useNavigate } from 'react-router-dom';


jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/notesService', () => ({
  fetchNotes: jest.fn(),
  deleteNote: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Dashboard Page', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ logout: mockLogout });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    fetchNotes.mockImplementation(() => new Promise(() => {})); // pending promise
    render(<Dashboard />);
    
    expect(screen.getByRole('main').querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders empty state when no notes exist', async () => {
    fetchNotes.mockResolvedValueOnce([]);
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No notes yet')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create First Note/i })).toBeInTheDocument();
    });
  });

  it('renders notes successfully', async () => {
    const mockNotes = [
      { id: 1, title: 'Note 1', content: 'Content 1', updatedAt: '2026-08-25T11:00:00Z' },
      { id: 2, title: 'Note 2', content: 'Content 2', updatedAt: '2026-08-26T11:00:00Z' },
    ];
    fetchNotes.mockResolvedValueOnce(mockNotes);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
    });
  });

  it('handles API failure and logs out on 401', async () => {
    const error = new Error('Unauthorized');
    error.status = 401;
    fetchNotes.mockRejectedValueOnce(error);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('handles note deletion and rollback on failure', async () => {
    const mockNotes = [
      { id: 1, title: 'Note 1', content: 'Content 1', updatedAt: '2026-08-25T11:00:00Z' },
    ];
    fetchNotes.mockResolvedValueOnce(mockNotes);
    
    const error = new Error('Failed to delete note');
    deleteNote.mockRejectedValueOnce(error);
    
    render(<Dashboard />);
    
    await waitFor(() => expect(screen.getByText('Note 1')).toBeInTheDocument());
    
    fireEvent.click(screen.getByTitle('Delete Note'));
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to delete note');
      expect(screen.getByText('Note 1')).toBeInTheDocument();
    });
  });
});
