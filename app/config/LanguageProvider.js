import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    search_placeholder: 'Search Restaurant',
    trending_restaurants: 'Trending Restaurants',
    discover_nearby: 'Discover Nearby Restaurants',
    featured_experiences: 'Featured Experiences',
    view_all: 'View All',
    tax_and_fees: 'Including Tax and Fees',
    from: 'From',
    guests: 'Guests',
    guest: 'Guest',
    search: 'Search',
    loading: 'Loading...',
    retry: 'Retry',
    error_loading: 'Failed to load restaurant list.',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // If not wrapped in provider (e.g. tests), return standard translation handler
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key) => translations.en[key] || key,
    };
  }
  return context;
};
export default LanguageContext;
