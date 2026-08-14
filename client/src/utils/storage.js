export const getNotes = () => {
  try {
    const data = localStorage.getItem('notes');
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn('Storage error: notes data is not an array. Resetting to empty.');
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse notes from storage:', error);
    return [];
  }
};

export const saveNotes = (notes) => {
  try {
    localStorage.setItem('notes', JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Failed to save notes to storage:', error);
    return false;
  }
};
