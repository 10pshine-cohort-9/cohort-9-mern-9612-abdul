import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteEditor from '../NoteEditor';
import { useAuth } from '../../context/AuthContext';
import { fetchNote, createNote, updateNote } from '../../services/notesService';
import { useNavigate, useParams } from 'react-router-dom';


jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/notesService', () => ({
  fetchNote: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockEditor = {
  getHTML: () => '<p>Mock Content</p>',
  commands: { setContent: jest.fn() },
  isActive: jest.fn(),
  chain: jest.fn(() => ({
    focus: jest.fn(() => ({
      toggleBold: jest.fn(() => ({ run: jest.fn() })),
      toggleItalic: jest.fn(() => ({ run: jest.fn() })),
      toggleHeading: jest.fn(() => ({ run: jest.fn() })),
      toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
      toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
      toggleBlockquote: jest.fn(() => ({ run: jest.fn() })),
    })),
  })),
  isDestroyed: false,
};

jest.mock('@tiptap/react', () => {
  const original = jest.requireActual('@tiptap/react');
  return {
    ...original,
    useEditor: jest.fn(() => mockEditor),
    EditorContent: () => <div data-testid="mock-editor">Mock Editor Content</div>,
  };
});

describe('NoteEditor Page', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ logout: mockLogout });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for creating a new note', () => {
    useParams.mockReturnValue({});
    
    render(<NoteEditor />);
    
    expect(screen.getByPlaceholderText('Untitled Document')).toBeInTheDocument();
    expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
    expect(screen.getByText('Drafting Note')).toBeInTheDocument();
  });

  it('loads existing note when ID is provided', async () => {
    useParams.mockReturnValue({ id: '1' });
    fetchNote.mockResolvedValueOnce({ id: 1, title: 'Existing Note', content: '<p>Content</p>' });
    
    render(<NoteEditor />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument();
      expect(screen.getByText('Editing Note')).toBeInTheDocument();
    });
  });

  it('handles save for a new note', async () => {
    useParams.mockReturnValue({});
    createNote.mockResolvedValueOnce({ id: 2, title: 'New Note' });
    
    render(<NoteEditor />);
    
    await userEvent.type(screen.getByPlaceholderText('Untitled Document'), 'New Note');
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    
    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith({
        title: 'New Note',
        content: '<p>Mock Content</p>',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles save for an existing note', async () => {
    useParams.mockReturnValue({ id: '1' });
    fetchNote.mockResolvedValueOnce({ id: 1, title: 'Old Title', content: '<p>Old</p>' });
    updateNote.mockResolvedValueOnce({ id: 1, title: 'Old Title Updated' });
    
    render(<NoteEditor />);
    
    await waitFor(() => expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText('Untitled Document'), { target: { value: 'Old Title Updated' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith('1', {
        title: 'Old Title Updated',
        content: '<p>Mock Content</p>',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error if title is empty on save', async () => {
    useParams.mockReturnValue({});
    
    render(<NoteEditor />);
    
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    
    expect(await screen.findByText('Please enter a title for your note.')).toBeInTheDocument();
    expect(createNote).not.toHaveBeenCalled();
  });
});
