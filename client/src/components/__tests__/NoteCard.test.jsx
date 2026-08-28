import { render, screen, fireEvent } from '@testing-library/react';
import NoteCard from '../NoteCard';


describe('NoteCard', () => {
  const mockNote = {
    id: 1,
    title: 'Test Note',
    content: '<p>Hello world</p>',
    updatedAt: '2026-08-25T11:00:00.000Z',
    tags: ['react', 'testing'],
  };

  it('renders note details and strips HTML from content', () => {
    render(<NoteCard note={mockNote} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('handles snake_case updated_at timestamp formatting', () => {
    const snakeCaseNote = { ...mockNote, updatedAt: null, updated_at: '2026-08-26T10:00:00.000Z' };
    render(<NoteCard note={snakeCaseNote} />);
    
    // Use regex to match different locale outputs for the formatted date
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it('handles invalid timestamps safely', () => {
    const invalidDateNote = { ...mockNote, updatedAt: 'invalid-date' };
    render(<NoteCard note={invalidDateNote} />);
    
    expect(screen.getByText('invalid-date')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const onClick = jest.fn();
    render(<NoteCard note={mockNote} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Open note: Test Note/i }));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    const onClick = jest.fn();
    render(<NoteCard note={mockNote} onClick={onClick} onDelete={onDelete} />);
    
    const deleteBtn = screen.getByTitle('Delete Note');
    fireEvent.click(deleteBtn);
    
    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onClick).not.toHaveBeenCalled(); // due to e.stopPropagation()
  });
});
