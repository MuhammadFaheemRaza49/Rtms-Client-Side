import menuReducer from './reducers';

export * from './actions';
export * from './operations';

/**
 * Selector to filter items by the selected category.
 * If category is 'All', returns all items.
 * @param {object} menuState - The local menu state object.
 * @returns {array} The filtered list of menu items.
 */
export const selectFilteredMenuItems = (menuState) => {
  const items = menuState?.items || [];
  const category = menuState?.selectedCategory || 'All';
  
  if (category === 'All') {
    return items;
  }
  return items.filter((item) => item.category === category);
};

export default menuReducer;
