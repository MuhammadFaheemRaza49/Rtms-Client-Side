import menuReducer, { selectFilteredMenuItems } from '../app/redux/menu';
import {
  setSelectedCategory,
  getMenuPending,
  getMenuSuccess,
  getMenuFailure,
} from '../app/redux/menu/actions';

describe('menu Redux Duck', () => {
  const initialState = {
    loading: false,
    error: null,
    categories: [],
    selectedCategory: 'All',
    items: [],
  };

  test('should return the initial state', () => {
    expect(menuReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle SET_SELECTED_CATEGORY', () => {
    const nextState = menuReducer(initialState, setSelectedCategory('Starters'));
    expect(nextState.selectedCategory).toBe('Starters');
  });

  test('should handle GET_MENU_PENDING', () => {
    const nextState = menuReducer(initialState, getMenuPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle GET_MENU_SUCCESS and prepend "All" if missing', () => {
    const mockData = {
      categories: ['Starters', 'Main Course'],
      items: [
        { id: 'm1', name: 'Spring Roll', category: 'Starters' },
        { id: 'm2', name: 'Steak', category: 'Main Course' },
      ],
    };

    const nextState = menuReducer(initialState, getMenuSuccess(mockData));
    expect(nextState.loading).toBe(false);
    expect(nextState.categories).toEqual(['All', 'Starters', 'Main Course']);
    expect(nextState.items).toEqual(mockData.items);
    expect(nextState.selectedCategory).toBe('All');
  });

  test('should handle GET_MENU_SUCCESS and keep "All" unique if already present', () => {
    const mockData = {
      categories: ['All', 'Starters'],
      items: [],
    };
    const nextState = menuReducer(initialState, getMenuSuccess(mockData));
    expect(nextState.categories).toEqual(['All', 'Starters']);
  });

  test('should handle GET_MENU_FAILURE', () => {
    const nextState = menuReducer(initialState, getMenuFailure('Failed to fetch menu'));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Failed to fetch menu');
  });

  describe('selectFilteredMenuItems Selector Helper', () => {
    const mockState = {
      selectedCategory: 'All',
      items: [
        { id: 'm1', name: 'Spring Roll', category: 'Starters' },
        { id: 'm2', name: 'Steak', category: 'Main Course' },
        { id: 'm3', name: 'Garlic Bread', category: 'Starters' },
      ],
    };

    test('should return all items when category is "All"', () => {
      const result = selectFilteredMenuItems(mockState);
      expect(result).toEqual(mockState.items);
    });

    test('should return filtered items when category is specified', () => {
      const result = selectFilteredMenuItems({
        ...mockState,
        selectedCategory: 'Starters',
      });
      expect(result).toEqual([
        { id: 'm1', name: 'Spring Roll', category: 'Starters' },
        { id: 'm3', name: 'Garlic Bread', category: 'Starters' },
      ]);
    });

    test('should return empty array if no items in state', () => {
      const result = selectFilteredMenuItems({
        selectedCategory: 'Starters',
        items: [],
      });
      expect(result).toEqual([]);
    });
  });
});
